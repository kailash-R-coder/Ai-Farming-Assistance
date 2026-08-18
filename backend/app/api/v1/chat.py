from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.api.deps import get_db, get_current_user_optional, get_current_user
from app.models.chat import ChatHistory
from app.models.user import User
from app.schemas.chat import ChatMessageInput, ChatResponse, ChatHistoryOut
from app.services.rag_service import RAGService

router = APIRouter(prefix="/chat", tags=["AI Farming Assistant"])


@router.post("", response_model=ChatResponse)
async def ask_farming_assistant(
    chat_in: ChatMessageInput,
    db: Session = Depends(get_db),
    current_user: Optional[User] = Depends(get_current_user_optional)
):
    """
    Ask agricultural questions in English or Malayalam.
    Uses RAG to retrieve official Kerala/ICAR practices with strict dosage safety guardrails.
    """
    if not chat_in.message.strip():
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Question message cannot be empty."
        )

    # Process question with RAG engine
    lang_pref = chat_in.language if chat_in.language and chat_in.language != "auto" else (
        current_user.preferred_language if current_user else "auto"
    )
    result = await RAGService.answer_question(chat_in.message, language_pref=lang_pref)

    # Save to history
    chat_record = ChatHistory(
        user_id=current_user.id if current_user else None,
        question=chat_in.message,
        answer=result["answer"],
        language=result["language"],
        sources=result.get("sources")
    )
    db.add(chat_record)
    db.commit()
    db.refresh(chat_record)

    return ChatResponse(
        answer=result["answer"],
        language=result["language"],
        sources=result.get("sources", []),
        confidence=result.get("confidence", 0.95)
    )


@router.get("/history", response_model=List[ChatHistoryOut])
def get_chat_history(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    """Fetch previous conversation history for the authenticated farmer."""
    chats = (
        db.query(ChatHistory)
        .filter(ChatHistory.user_id == current_user.id)
        .order_by(ChatHistory.created_at.desc())
        .limit(50)
        .all()
    )
    return chats
