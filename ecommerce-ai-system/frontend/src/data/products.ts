export interface Product {
    id: number;
    name: string;
    description: string;
    category: string;
    price: number;
    image_url: string;
    ai_rating: number;
    reviews: { text: string; sentiment: 'positive' | 'neutral' | 'negative' }[];
}

export const products: Product[] = [
    {
        id: 1,
        name: "Lumina Smart Lamp",
        description: "An AI-powered lamp that adjusts brightness and color temperature based on your circadian rhythm and mood.",
        category: "Smart Home",
        price: 129.99,
        image_url: "https://images.unsplash.com/photo-1534073828943-f801091bb18c?auto=format&fit=crop&q=80&w=800",
        ai_rating: 94,
        reviews: [
            { text: "The adaptive lighting really improved my sleep quality.", sentiment: 'positive' },
            { text: "Sleek design but the app setup was a bit slow.", sentiment: 'neutral' }
        ]
    },
    {
        id: 2,
        name: "NeoBound Earbuds",
        description: "High-fidelity noise-canceling earbuds with real-time AI translation and spatial audio tracking.",
        category: "Audio",
        price: 199.50,
        image_url: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800",
        ai_rating: 98,
        reviews: [
            { text: "Translation is impressively fast and accurate.", sentiment: 'positive' },
            { text: "Best spatial audio I've ever experienced.", sentiment: 'positive' }
        ]
    },
    {
        id: 3,
        name: "Aura Wellness Ring",
        description: "A sleek titanium ring that uses AI to monitor your sleep, heart rate, and stress levels 24/7.",
        category: "Wearables",
        price: 299.00,
        image_url: "https://images.unsplash.com/photo-1610940882244-596cc3794b15?auto=format&fit=crop&q=80&w=800",
        ai_rating: 92,
        reviews: [
            { text: "Minimalist and powerful. The stress analysis is a game changer.", sentiment: 'positive' }
        ]
    },
    {
        id: 4,
        name: "Zenith Pro Projector",
        description: "4K AI-upscaling laser projector that creates a cinematic experience in any lighting condition.",
        category: "Home Theater",
        price: 1499.00,
        image_url: "https://images.unsplash.com/photo-1535016120720-40c646bebbfc?auto=format&fit=crop&q=80&w=800",
        ai_rating: 96,
        reviews: [
            { text: "Upscaling works like magic on old movies.", sentiment: 'positive' }
        ]
    },
    {
        id: 5,
        name: "Grip Pro Fitness Tracker",
        description: "Advance fitness tracker with AI coaching that analyzes your form and suggests improvements.",
        category: "Wearables",
        price: 149.00,
        image_url: "https://images.unsplash.com/photo-1557166983-593964aa0331?auto=format&fit=crop&q=80&w=800",
        ai_rating: 88,
        reviews: [
            { text: "Really helps with my squat form. Highly recommended.", sentiment: 'positive' }
        ]
    },
    {
        id: 6,
        name: "PureAir Smart Purifier",
        description: "Intelligent air purifier that detects pollutants and adjusts fan speed using deep learning algorithms.",
        category: "Smart Home",
        price: 349.99,
        image_url: "https://images.unsplash.com/photo-1585789613142-99572ec4325a?auto=format&fit=crop&q=80&w=800",
        ai_rating: 90,
        reviews: [
            { text: "Quiet and efficient. The AI sensor is very responsive.", sentiment: 'positive' }
        ]
    },
    {
        id: 7,
        name: "Swift Charge Pro",
        description: "65W GaN charger with AI power distribution to safely charge multiple devices simultaneously.",
        category: "Accessories",
        price: 49.00,
        image_url: "https://images.unsplash.com/photo-1625517173952-003a75a96789?auto=format&fit=crop&q=80&w=800",
        ai_rating: 85,
        reviews: [
            { text: "Charges my laptop and phone perfectly.", sentiment: 'positive' }
        ]
    },
    {
        id: 8,
        name: "Neural Focus Headset",
        description: "Brainwave-sensing headset that uses AI to detect focus levels and plays optimized background sounds.",
        category: "Wellness",
        price: 399.00,
        image_url: "https://images.unsplash.com/photo-1544117518-29efd6f82791?auto=format&fit=crop&q=80&w=800",
        ai_rating: 95,
        reviews: [
            { text: "Increases my deep focus hours significantly.", sentiment: 'positive' }
        ]
    },
    {
        id: 9,
        name: "CyberWatch Elite",
        description: "Next-gen smartwatch with holographic display and AI-enhanced predictive health alerts.",
        category: "Wearables",
        price: 599.00,
        image_url: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800",
        ai_rating: 93,
        reviews: [
            { text: "The holographic UI is stuning.", sentiment: 'positive' }
        ]
    },
    {
        id: 10,
        name: "EchoFlow Speakers",
        description: "Modular apartment speakers that use AI to map your room's acoustics and adjust sound output.",
        category: "Audio",
        price: 450.00,
        image_url: "https://images.unsplash.com/photo-1545454675-3531b543be5d?auto=format&fit=crop&q=80&w=800",
        ai_rating: 91,
        reviews: [
            { text: "Fills the entire room evenly. Magic.", sentiment: 'positive' }
        ]
    },
    {
        id: 11,
        name: "Titan Workstation",
        description: "AI-optimized compact PC built for heavy machine learning tasks and high-end neural processing.",
        category: "Computing",
        price: 2499.00,
        image_url: "https://images.unsplash.com/photo-1587831990711-23ca6441447b?auto=format&fit=crop&q=80&w=800",
        ai_rating: 99,
        reviews: [
            { text: "Absolute beast for training local LLMs.", sentiment: 'positive' }
        ]
    },
    {
        id: 12,
        name: "Vision Pro Shades",
        description: "Smart glasses with AI-powered object recognition and real-time navigation overlay.",
        category: "Wearables",
        price: 899.00,
        image_url: "https://images.unsplash.com/photo-1572635196237-14b3f281503f?auto=format&fit=crop&q=80&w=800",
        ai_rating: 97,
        reviews: [
            { text: "The object recognition is futuristic. Feels like Iron Man.", sentiment: 'positive' }
        ]
    }
];
