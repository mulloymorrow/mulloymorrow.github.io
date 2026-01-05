// Mapping of technology names to Wikipedia URLs
// Some technologies need special handling for their Wikipedia page names

const techToWiki: Record<string, string> = {
  // Cloud & Infrastructure
  "GCP": "Google_Cloud_Platform",
  "AWS": "Amazon_Web_Services",
  "Cloud Infrastructure": "Cloud_computing",
  "Kubernetes": "Kubernetes",
  "Docker": "Docker_(software)",
  
  // ML/AI Frameworks
  "TensorFlow": "TensorFlow",
  "PyTorch": "PyTorch",
  "Scikit-learn": "Scikit-learn",
  "Apache Beam": "Apache_Beam",
  
  // AI/ML Concepts
  "LLMs": "Large_language_model",
  "RAG": "Retrieval-augmented_generation",
  "Agentic AI": "Agentic_AI",
  "Agentic-AI": "Agentic_AI",
  "NLP": "Natural_language_processing",
  "Computer Vision": "Computer_vision",
  "Machine Learning": "Machine_learning",
  "ML/Statistical Modeling": "Statistical_model",
  "Transformers": "Transformer_(deep_learning_architecture)",
  "Two-Tower Models": "Two-tower_model",
  "Wide-and-Deep": "Wide_%26_deep_learning",
  "Generative AI": "Generative_artificial_intelligence",
  "Privacy-Preserving ML": "Privacy-preserving_machine_learning",
  
  // Databases
  "PostgreSQL": "PostgreSQL",
  "BigQuery": "BigQuery",
  "Vector Databases": "Vector_database",
  "Vector DBs": "Vector_database",
  "Elasticsearch": "Elasticsearch",
  
  // Programming Languages
  "Python": "Python_(programming_language)",
  "Scala": "Scala_(programming_language)",
  "Java": "Java_(programming_language)",
  "MATLAB": "MATLAB",
  "C++": "C%2B%2B",
  
  // Data Processing
  "Spark": "Apache_Spark",
  "Data Pipelines": "Data_pipeline",
  "Feature Engineering": "Feature_engineering",
  "Experimentation": "A/B_testing",
  
  // Specialized
  "Document AI": "Document_AI",
  "HIPAA/HITECH Compliance": "Health_Insurance_Portability_and_Accountability_Act",
  "Healthcare Data Security": "Health_information_privacy",
  "Gaussian Processes": "Gaussian_process",
  "Dynamic Textures": "Dynamic_texture",
  "Video Analytics": "Video_content_analysis",
  "Distributed Systems": "Distributed_computing",
  "Anomaly Detection": "Anomaly_detection",
  "Behavioral Modeling": "Behavioral_modeling",
  "Content Moderation": "Content_moderation",
  "Geospatial ML": "Geospatial_analysis",
  "Signal Processing": "Signal_processing",
  "Video Processing": "Video_processing",
  "Telemetry Analysis": "Telemetry",
  "Clustering": "Cluster_analysis",
  "Statistical Modeling": "Statistical_model",
  "Claims Analysis": "Insurance_claim",
  "Healthcare Information Exchange (HIE)": "Health_information_exchange",
  "Healthcare Fraud Detection": "Healthcare_fraud",
  "Custom ML Libraries": "Machine_learning_library",
  "Real-time ML": "Real-time_computing",
  "Surgical Planning": "Surgical_planning",
  "Medical Robotics": "Medical_robot",
  "Technical Due Diligence": "Due_diligence",
  
  // Education
  "Physics": "Physics",
  "Electrical Engineering": "Electrical_engineering",
  "Mathematics": "Mathematics",
  "Digital Media": "Digital_media",
  "Creative Technology": "Creative_technology",
};

export function getTechWikiUrl(tech: string): string {
  // Check if we have a specific mapping
  if (techToWiki[tech]) {
    return `https://en.wikipedia.org/wiki/${techToWiki[tech]}`;
  }
  
  // Default: convert to Wikipedia URL format
  // Replace spaces with underscores, handle special characters
  const wikiName = tech
    .replace(/\s+/g, '_')
    .replace(/\+/g, '%2B')
    .replace(/&/g, '%26');
  
  return `https://en.wikipedia.org/wiki/${wikiName}`;
}

