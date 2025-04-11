export async function compressImage(imageUrl) {
    const apiKey = "80ZVvt0GBBBrvlF6rfkFhBgVHMjyKqyQ"; // TinyPNG API Key
    try {
        const response = await fetch("https://api.tinify.com/shrink", {
            method: "POST",
            headers: {
                Authorization: "Basic " + btoa("api:" + apiKey),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ source: { url: imageUrl } })
        });

        if (!response.ok) {
            console.error("TinyPNG Compression Failed:", response.statusText);
            return imageUrl; // Return original if it fails
        }

        const data = await response.json();
        return data.output.url; // Return the optimized image URL
    } catch (error) {
        console.error("TinyPNG API Error:", error);
        return imageUrl; // Use original if API fails
    }
}
