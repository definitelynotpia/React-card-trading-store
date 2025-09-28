import { FaStar } from "react-icons/fa";

export default function StarRatingBar({ rating, max = 5 }) {
	return (<div style={{ display: "flex", gap: 2 }}>
		{Array.from({ length: max }).map((_, i) => {
			const starValue = Math.min(Math.max(rating - i, 0), 1);
			const percent = starValue * 100;

			return (
				<div key={i} className="mx-auto my-1" style={{ position: "relative", display: "inline-block", width: 26, height: 26 }} >
					<FaStar size={26} color="#e0e0e0" style={{ position: "absolute", top: 0, left: 0 }} />
					<div style={{
						position: "absolute",
						top: 0,
						left: 0,
						width: `${percent}%`,
						overflow: "hidden",
						height: "100%",
					}}>
						<FaStar size={26} color="gold" />
					</div>
				</div>
			);
		})}
	</div>);
}
