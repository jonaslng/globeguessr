export default function StreetView() {
    return (
        <div className="flex flex-col items-center w-full h-screen overflow-hidden">
            <div>
                <iframe
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    src="https://www.google.com/maps/embed?pb=!4v1742037468563!6m8!1m7!1s61hWxbJQoPqlKo7IkXv7zg!2m2!1d51.68911826448056!2d7.46599332320037!3f295.60328859679873!4f-6.993562478154843!5f0.7820865974627469"
                    allow="autoplay; clipboard-write; encrypted-media; picture-in-picture"
                    style={{
                        width: "100vw",
                        height: "calc(100vh + 310px)",
                        zIndex: 100,
                        transform: "translateY(-295px)",
                        overflow: "hidden",
                        border: "none",
                        outline: "none"
                    }}
                    allowFullScreen
                ></iframe>
            </div>
        </div>
    );
}