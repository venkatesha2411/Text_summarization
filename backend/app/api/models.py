from typing import List

from fastapi import APIRouter, HTTPException, status, Depends

from app.models.models import TextSummaryModel, get_model, ModelOutput, PredictionInput, PredictionOutput


router = APIRouter()

# @router.get("/")
# async def all() -> List[Post]:
#     return list(db.posts.values())


@ router.get("/models", response_model=ModelOutput)
async def models(
    model: TextSummaryModel = Depends(get_model),
) -> ModelOutput:
    output: ModelOutput = model.get_models()
    return output


@ router.post("/prediction", response_model=PredictionOutput)
def prediction(
    request: PredictionInput,
    model: TextSummaryModel = Depends(get_model),
) -> PredictionOutput:
    output: PredictionOutput = model.predict(request)
    return output


@ router.on_event("startup")
async def startup():
    # Initialize the HuggingFace summarization pipeline
    get_model().load_model()