!pip install diagrams

from diagrams import Diagram, Cluster
from diagrams.onprem.client import Client
from diagrams.onprem.compute import Server
from diagrams.onprem.database import PostgreSQL
from diagrams.generic.blank import Blank
from diagrams.generic.storage import Storage
from diagrams.onprem.analytics import Spark
from diagrams.onprem.queue import Kafka
from diagrams.onprem.monitoring import Prometheus
from diagrams.saas.identity import Auth0

with Diagram("AI PK Health App Architecture", show=True, direction="LR"):
    
    # User + Mobile App
    with Cluster("User Devices"):
        user = Client("User")
        mobile_app = Blank("Mobile App\n(Android / iOS)")
    
    # Backend Layer
    with Cluster("Backend API & Services"):
        api_gateway = Server("API Gateway")
        auth_service = Auth0("Auth & Sessions")
        profile_service = Server("User & Medication\nProfile Service")
        timeline_service = Server("Data Fusion &\nTimeline Service")
        research_exporter = Server("Anonymized\nResearch Export")
        audit_logger = Prometheus("Audit Logging")
        alert_service = Kafka("Push/SMS/Email\nAlert Dispatcher")

    # Data & Storage
    with Cluster("Data Layer"):
        main_db = PostgreSQL("Main DB\n(Users, Meds, Consents)")
        timeline_db = PostgreSQL("Time-Series DB\nSignals & Events)")
        encrypted_storage = Storage("Encrypted\nBackups")

    # AI / ML
    with Cluster("AI & ML Models"):
        feature_engineering = Spark("Feature\nEngineering Pipeline")
        pk_model = Spark("PK Model")
        ae_model = Spark("Adverse Effect\nPrediction Model")
        explain_api = Server("Explainability API")

    # External Systems
    with Cluster("External Integrations"):
        wearables = Blank("Wearable / Health APIs\n(HealthKit / Health Connect)")
        research_datalake = Storage("Research Data Lake")

    # Connections
    user >> mobile_app >> api_gateway
    
    api_gateway >> auth_service
    api_gateway >> profile_service
    api_gateway >> timeline_service
    api_gateway >> research_exporter
    api_gateway >> audit_logger
    api_gateway >> alert_service

    profile_service >> main_db
    timeline_service >> timeline_db

    # Wearables feed data
    wearables >> timeline_service
    wearables >> feature_engineering

    # ML pipeline
    main_db >> feature_engineering
    timeline_db >> feature_engineering

    feature_engineering >> pk_model
    feature_engineering >> ae_model

    pk_model >> explain_api
    ae_model >> explain_api

    explain_api >> api_gateway

    research_exporter >> research_datalake

    encrypted_storage << main_db
    encrypted_storage << timeline_db