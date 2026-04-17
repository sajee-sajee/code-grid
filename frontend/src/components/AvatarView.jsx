export default function AvatarView({ avatar, size = 160, width, height, borderRadius = "12px" }) {
    const head = avatar?.head || "/avatars/head1.png";
    const body = avatar?.body || "/avatars/body1.png";
    const foot = avatar?.foot || "/avatars/foot1.png";

    const w = width || size;
    const h = height || (w * 1.25); // Vertical rectangle matched closer to 800x986 native ratio

    return (
        <div style={{ width: w, height: h, backgroundImage: "url(/assets/test_tube.png)", backgroundSize: "contain", backgroundPosition: "center", backgroundRepeat: "no-repeat", position: "relative", flexShrink: 0 }}>
            <img src={body} style={{ position: "absolute", top: "5%", left: 0, width: "100%", height: "100%", objectFit: "contain", transform: "scale(0.85)", zIndex: 2 }} alt="body" />
            <img src={head} style={{ position: "absolute", top: "5%", left: 0, width: "100%", height: "100%", objectFit: "contain", transform: "scale(0.85)", zIndex: 3 }} alt="head" />
            <img src={foot} style={{ position: "absolute", top: "5%", left: 0, width: "100%", height: "100%", objectFit: "contain", transform: "scale(0.85)", zIndex: 1 }} alt="foot" />
        </div>
    );
}
