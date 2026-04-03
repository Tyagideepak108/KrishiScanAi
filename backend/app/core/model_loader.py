"""
Model Loader - tera Streamlit wala load_model aur predict logic
yahan FastAPI ke liye port kiya gaya hai.
Models sirf ek baar startup pe load hote hain - memory efficient.
"""
import numpy as np
import tensorflow as tf
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.applications.mobilenet_v2 import preprocess_input
from PIL import Image
from app.core.config import settings
import io


# --- Exact same fix as tera Streamlit app ---
class CompatibleDepthwiseConv2D(tf.keras.layers.DepthwiseConv2D):
    def __init__(self, *args, **kwargs):
        kwargs.pop('groups', None)
        super().__init__(*args, **kwargs)


# --- Class names - exactly as in tera app.py ---
SUGARCANE_CLASS_NAMES = sorted([
    "Banded Chlorosis", "Brown Spot", "BrownRust", "Dried Leaves", "Grassy shoot",
    "Healthy Leaves", "Pokkah Boeng", "Sett Rot", "smut", "Viral Disease",
    "Yellow Leaf", "Red Stripe(viral Disease)"
])

OTHER_CLASS_NAMES = sorted([
    "Pepper__bell___Bacterial_spot", "Pepper__bell___healthy",
    "Potato___Early_blight", "Potato___Late_blight", "Potato___healthy",
    "Tomato___Bacterial_spot", "Tomato___Early_blight", "Tomato___Late_blight",
    "Tomato___Leaf_Mold", "Tomato___Septoria_leaf_spot",
    "Tomato___Spider_mites Two-spotted_spider_mite",
    "Tomato___Target_Spot", "Tomato___Tomato_Yellow_Leaf_Curl_Virus",
    "Tomato___Tomato_mosaic_virus", "Tomato___healthy"
])


class ModelLoader:
    def __init__(self):
        self._sugarcane_model = None
        self._other_model = None

    def load_models(self):
        """Called once at FastAPI startup"""
        custom_objects = {'DepthwiseConv2D': CompatibleDepthwiseConv2D}
        try:
            self._sugarcane_model = tf.keras.models.load_model(
                settings.SUGARCANE_MODEL_PATH,
                custom_objects=custom_objects,
                compile=False
            )
            print(f"Sugarcane model loaded: {settings.SUGARCANE_MODEL_PATH}")
        except Exception as e:
            print(f"[ERROR] Could not load sugarcane model: {e}")

        try:
            self._other_model = tf.keras.models.load_model(
                settings.OTHER_CROPS_MODEL_PATH,
                custom_objects=custom_objects,
                compile=False
            )
            print(f"Other crops model loaded: {settings.OTHER_CROPS_MODEL_PATH}")
        except Exception as e:
            print(f"[ERROR] Could not load other crops model: {e}")

    def models_ready(self) -> dict:
        return {
            "sugarcane": self._sugarcane_model is not None,
            "other_crops": self._other_model is not None
        }

    def get_model(self, crop_type: str):
        if crop_type == "sugarcane":
            return self._sugarcane_model, SUGARCANE_CLASS_NAMES
        else:
            return self._other_model, OTHER_CLASS_NAMES

    # ---- Exact same logic as tera predict.py ----
    def preprocess_image(self, image: Image.Image, model) -> np.ndarray | None:
        """Tera preprocess_image function - same logic"""
        if image is None or model is None:
            return None
        try:
            if image.mode != 'RGB':
                image = image.convert('RGB')
            input_shape = model.input_shape[1:3]
            image = image.resize(input_shape)
            image_array = img_to_array(image)
            image_array = tf.expand_dims(image_array, axis=0)
            processed = preprocess_input(image_array)
            return processed
        except Exception as e:
            print(f"[ERROR] Preprocessing failed: {e}")
            return None

    def predict(self, image: Image.Image, crop_type: str, threshold: float = 60.0) -> dict:
        """
        Tera predict_disease function - same logic, dict return karta hai
        Returns: {predicted_class, confidence, is_confident, top3}
        """
        model, class_names = self.get_model(crop_type)
        if model is None:
            raise RuntimeError(f"Model for '{crop_type}' is not loaded.")

        processed = self.preprocess_image(image, model)
        if processed is None:
            return {
                "predicted_class": None,
                "confidence": 0.0,
                "is_confident": False,
                "top3": []
            }

        predictions = model.predict(processed)
        predicted_index = int(np.argmax(predictions))
        predicted_class = class_names[predicted_index]
        confidence = float(predictions[0][predicted_index]) * 100
        is_confident = confidence >= threshold

        # Top 3 predictions (for richer API response)
        top3_indices = np.argsort(predictions[0])[-3:][::-1]
        top3 = [
            {
                "disease": class_names[int(i)],
                "confidence": round(float(predictions[0][i]) * 100, 2)
            }
            for i in top3_indices
        ]

        print(f"[DEBUG] Crop: {crop_type} | Class: {predicted_class} | Conf: {confidence:.2f}%")

        return {
            "predicted_class": predicted_class,
            "confidence": round(confidence, 2),
            "is_confident": is_confident,
            "top3": top3
        }

    def predict_from_bytes(self, image_bytes: bytes, crop_type: str, threshold: float = 60.0) -> dict:
        """FastAPI file upload se bytes aate hain - yeh helper usse handle karta hai"""
        image = Image.open(io.BytesIO(image_bytes))
        return self.predict(image, crop_type, threshold)


# Singleton instance - app-wide ek hi object
model_loader = ModelLoader()