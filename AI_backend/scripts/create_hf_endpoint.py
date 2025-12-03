from huggingface_hub import create_inference_endpoint

create_inference_endpoint(
    name="drug-model",
    repository="your-username/your-repo",
    framework="tensorflow",
    task="tabular-regression"
)
