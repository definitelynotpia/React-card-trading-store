import "../App.css";
import "../styles/explore.css";
import "../styles/profile.css";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
// firebase
import { useAuth } from "../services/authContext";
import { signOut } from "firebase/auth";
import { auth, db } from "../services/firebase";
import { arrayRemove, arrayUnion, collection, doc, getDocs, limit, onSnapshot, orderBy, query, serverTimestamp, updateDoc, where } from "firebase/firestore";
// ui
import { playCardFlipSfx } from "../utils/sfx";
import { Button, Card, Col, OverlayTrigger, Row, Tooltip } from "react-bootstrap";
import { CardBack, CardFront } from "../components/card";
import { FaHeart, FaStar } from "react-icons/fa";
// card type icons
import DarknessIcon from "../assets/card-icons/dark.png";
import DragonIcon from "../assets/card-icons/dragon.png";
import FairyIcon from "../assets/card-icons/fairy.png";
import FightingIcon from "../assets/card-icons/fighting.png";
import FireIcon from "../assets/card-icons/fire.png";
import GrassIcon from "../assets/card-icons/grass.png";
import LightningIcon from "../assets/card-icons/electric.png";
import ColorlessIcon from "../assets/card-icons/normal.png";
import PsychicIcon from "../assets/card-icons/psychic.png";
import MetalIcon from "../assets/card-icons/steel.png";
import WaterIcon from "../assets/card-icons/water.png";
import StarRatingBar from "../components/starRatingBar";
import { useCardsByIds } from "../services/pokemonQueries";

export default function Profile() {
	const { username } = useParams(); // from /:username/profile
	const navigate = useNavigate();
	const { userData } = useAuth(); // logged-in user
	const [profileUser, setProfileUser] = useState(null); // the user being viewed
	const [reviews, setReviews] = useState([]);
	const [products, setProducts] = useState([]);
	const [favCards, setFavCards] = useState([]);
	const { data: favCardObjects = [], isLoading } = useCardsByIds(favCards);

	useEffect(() => {
		let unsubscribe;

		const fetchProfile = async () => {
			try {
				// If no username param, show own profile
				if (!username && userData) {
					setProfileUser(userData);
					return;
				}

				// Otherwise fetch by username
				const qUsers = query(
					collection(db, "users"),
					where("username", "==", username),
					limit(1)
				);
				const snapUsers = await getDocs(qUsers);

				// Otherwise fetch by username
				const qProducts = query(
					collection(db, "products"),
					where("sellerUsername", "==", username),
					limit(1)
				);
				const snapProducts = await getDocs(qProducts);

				const docSnapUsers = snapUsers.docs[0];
				const profile = { id: docSnapUsers.id, ...docSnapUsers.data() };
				setProfileUser(profile);

				const docSnapProducts = snapProducts.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
				setProducts(docSnapProducts);

				// Fetch reviews
				if (profile.role === "seller") {
					console.log("is seller")
					const reviewsRef = collection(db, "users", profile.id, "reviews");
					const qReviews = query(reviewsRef, orderBy("rating", "desc"));
					const reviewsSnap = await getDocs(qReviews);

					setReviews(reviewsSnap.docs.map(d => ({ id: d.id, ...d.data() })));
					console.log("reviews set");

					// compute avg if missing
					if (reviewsSnap.size > 0 && profile.avgRating === undefined) {
						const ratings = reviewsSnap.docs.map(d => d.data().rating);
						const avg = ratings.reduce((a, b) => a + b, 0) / ratings.length;
						setProfileUser(prev => ({
							...prev,
							avgRating: avg,
							totalReviewCount: ratings.length,
						}));
					}
				}

				// real-time fetch of fav cards
				const userRef = doc(db, "users", profile.id);
				const unsubscribe = onSnapshot(userRef, (snapshot) => {
					const data = snapshot.data();
					const favs = Array.isArray(data?.favorites) ? data.favorites : [];
					setFavCards(favs);
				});
				return () => unsubscribe();
			} catch (err) {
				console.error("Error fetching profile:", err);
			}
		};

		fetchProfile();

		return () => unsubscribe && unsubscribe();
	}, [username, userData, navigate]);

	// ui state
	const [grabbingCard, setGrabbingCard] = useState(null);
	const [flippedCards, setFlippedCards] = useState({});
	// map icon to card type
	const typeIcons = {
		Colorless: ColorlessIcon,
		Darkness: DarknessIcon,
		Dragon: DragonIcon,
		Fairy: FairyIcon,
		Fighting: FightingIcon,
		Fire: FireIcon,
		Grass: GrassIcon,
		Lightning: LightningIcon,
		Metal: MetalIcon,
		Psychic: PsychicIcon,
		Water: WaterIcon,
	};

	const toggleFlip = (cardId) => {
		setFlippedCards(prev => ({
			...prev,
			[cardId]: !prev[cardId]
		}));
	};

	const toggleFav = async (card) => {
		const userRef = doc(db, "users", profileUser.uid);
		const isFav = favCards.includes(card.id);
		if (isFav) {
			// update local state
			setFavCards((prev) => prev.filter((id) => id !== card.id));
			// remove from Firestore
			await updateDoc(userRef, {
				favorites: arrayRemove(card.id),
			});
		} else {
			// update local state
			setFavCards((prev) => [...prev, card.id]);
			// add to Firestore
			await updateDoc(userRef, {
				favorites: arrayUnion(card.id),
			});
		}
	};

	const formatReviewDate = (timestamp) => {
		if (!timestamp?.toDate) return "";
		const date = timestamp.toDate();
		const now = new Date();

		// if date today, display time posted
		const isSameDay = (d1, d2) =>
			d1.getFullYear() === d2.getFullYear() &&
			d1.getMonth() === d2.getMonth() &&
			d1.getDate() === d2.getDate();
		if (isSameDay(date, now)) {
			return date.toLocaleTimeString(undefined, {
				hour: "2-digit",
				minute: "2-digit",
			});
		}
		// if date yesterday
		const yesterday = new Date();
		yesterday.setDate(now.getDate() - 1);
		if (isSameDay(date, yesterday)) {
			return "Yesterday";
		}
		// else, format as date only
		return date.toLocaleDateString(undefined, {
			year: "numeric",
			month: "short",
			day: "numeric",
		});
	};

	const handleLogout = async () => {
		try {
			const uid = auth.currentUser?.uid;
			if (uid) {
				await updateDoc(doc(db, "users", uid), {
					isOnline: false,
					lastSeen: serverTimestamp(),
				});
			}
			await signOut(auth);
			navigate("/login");
		} catch (error) {
			console.log("Sign out error:", error);
			alert("Sign out error:", error);
		}
	};

	return (<div className="profile">
		{profileUser ? <Row className="g-0">
			<Col sm={2} className="profile-bg profile-right-col px-3 d-flex flex-column justify-content-start align-items-start">
				<img src={profileUser.photoURL} alt={`${profileUser.displayName} profile`} className="profile-img align-self-center" onContextMenu={(e) => { e.preventDefault() }} />
				<div className="profile-info my-3">
					<h3 className="mb-1 fw-bold">{profileUser.displayName}</h3>
					<p className="profile-email m-0">{profileUser.email}</p>
				</div>
				<p className="border-start border-primary border-2 ps-2 py-1 mt-2">{profileUser.bio}</p>
				{/* <Button variant="outline-dark" className="w-100 my-2">Settings</Button> */}
				<Button variant="outline-dark" className="justify-self-end w-100 mt-auto mb-3" onClick={handleLogout}>Logout</Button>
			</Col>

			<Col sm={10} className="profile-left-col">
				{profileUser.role === "seller" && <Row className="px-4">
					<Col sm={2}>
						<Card className="seller-rating">
							<h5 className="text-center m-0">Seller Rating</h5>
							{reviews.length === 0 ? <h1>None</h1> : <>
								<p className="avg-rating">{profileUser.avgRating.toFixed(2)}</p>
								<StarRatingBar rating={profileUser.avgRating} />
							</>}
							<p className="disclaimer">All reviews are verified by TradeBall. Only reviews with comments are shown.</p>
						</Card>
					</Col>
					<Col sm={4} className="reviews g-0">
						{reviews === 0 ? <></> :
							reviews.map((review, i) => {
								if (!review.comment) return(<></>);
								return (<div key={review.id} className="border-bottom">
									<div className="d-flex flex-row justify-content-between align-content-center">
										<div className="d-flex flex-row align-content-center">
											{Array.from({ length: review.rating }, () => (
												<FaStar size={15} color="gold" />
											))}
											{review.rating !== 5 && Array.from({ length: (5 - review.rating) }, () => (
												<FaStar size={15} color="#e0e0e0" />
											))}
											<p className="mb-2 ms-1 fw-bold small">{review.rating}</p>
										</div>
										<div className="d-flex flex-row align-content-center">
											<Link to={`/${review.reviewerUsername}/profile`} className="m-0 small fw-bold text-dark text-decoration-none">{review.reviewerUsername}</Link>
											<p className="mb-0 mx-1 small text-muted">|</p>
											<p className="m-0 small text-muted">{formatReviewDate(review.createdAt)}</p>
										</div>
									</div>
									{/* <div className="d-flex flex-row justify-content-between my-2">
									</div> */}
									<p className="m-0 review-comment">{review.comment}</p>
								</div>);
							})}
					</Col>
					<Col sm={6} className="profile-listings">
						<h4 className="mb-3">Listings</h4>
						{products === 0 ? <></> :
							products.map(listing => (
								<div className="listing-card d-flex flex-row justify-content-between align-items-start">
									<div className="listing-images me-3">
										<img src={listing.images[0]} alt={listing.title} className="listing-thumb" />
										{listing.images.length > 1 && <p className="listing-images-count">{listing.images.length}</p>}
									</div>

									<div className="d-flex flex-column flex-grow-1">
										<h6 className="listing-title">{listing.title}</h6>
										<p className="listing-seller">@{listing.sellerUsername}</p>
										<p className="seller-description">{listing.description}</p>

										<div className="tags d-flex flex-row flex-wrap">
											{listing.condition}
											{listing.foil}
											{listing.language}
											{listing.packaging}
											{listing.printing}
											{listing.quality}
											{listing.tags.map((tag, i) => (
												<span key={`${listing.id}-tag-${i}`} className="custom-gradient-badge me-1 my-1">
													{tag}
												</span>
											))}
										</div>
									</div>

									<div className="listing-price text-end">
										<h5 className="fw-bold">₱{listing.price}</h5>
										<button className="btn btn-primary btn-sm mt-2">Add to Cart</button>
									</div>

								</div>
							))}
					</Col>
				</Row>}

				{!isLoading && favCardObjects.length > 0 && <Row className="px-5 mb-5">
					{profileUser.role === "seller" && <hr />}
					<h2 className="mb-4 ms-3 highlight-bg fw-bold">Favorite Cards</h2>
					<div className="products-grid">
						{favCardObjects.map((card) => (
							<Card key={card.id ?? card.name} className="product-card">
								<div className={`flip-card ${grabbingCard === card.id ? 'grabbing' : ''}`}
									// toggle card flipping animation and play card flip sfx
									onClick={() => { playCardFlipSfx(); toggleFlip(card.id); }}
									// change cursor appearance to grabbing when clicking
									onMouseDown={() => setGrabbingCard(card.id)}
									onMouseUp={() => setGrabbingCard(null)}
									onMouseLeave={() => setGrabbingCard(null)} >
									<div className={`flip-card-inner ${flippedCards[card.id] ? 'flipped' : ''}`}>
										<div className="flip-card-front">
											<CardFront card={card} />
										</div>
										<div className="flip-card-back">
											<CardBack card={card} />
										</div>
									</div>
								</div>

								<div className="mx-2 mb-2">
									<div className="d-flex flex-row justify-content-between align-items-center my-1 p-0">
										<div className="d-flex flex-row justify-content-end align-items-end">
											<h4 className="card-name fw-bold my-0 px-0 py-1"
												style={{ maxWidth: `calc(222px - ${28 * (card.types.length || 0)}px)` }}
											>{card.name}</h4>
											{card.level && <p className="card-level ms-1 mx-2 my-0 px-0 py-1">Lvl {card.level}</p>}
										</div>
										<div className="d-flex flex-row justify-content-start align-items-center">
											{card.types?.map((type, i) => {
												console.log(`${card.name} type:`, type);
												return (<OverlayTrigger key={`${card.id}-type-${i}`} placement="left"
													overlay={<Tooltip id={`tooltip-${card.id}-${i}`}>{type}</Tooltip>} >
													<img alt={type} src={typeIcons[type]} width="28px"
														className="card-type p-0 m-0" />
												</OverlayTrigger>);
											}
											)}
										</div>
									</div>

									<div className="d-flex flex-row justify-content-center align-items-center">
										{favCards.includes(card.id) ?
											<FaHeart onClick={() => toggleFav(card)} size={28} color="red" /> :
											<FaHeart onClick={() => toggleFav(card)} size={28} color="#0000003d" />}
										<Link to={`/explore/${card.id}`} state={{ card }} className="listings w-100 ms-2">
											<Button variant="outline-dark" className="w-100">View Listings</Button>
										</Link>
									</div>
								</div>
							</Card>
						))}
					</div>
				</Row>}
			</Col>
		</Row> : <h1 className="m-5 p-5 text-center">Loading profile...</h1>}
	</div>);
}