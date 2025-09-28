import "../App.css";
// react
import { playCardFlipSfx } from "../utils/sfx";
import { OverlayTrigger, Tooltip, Pagination, Card, Button } from "react-bootstrap";
import { CardFront, CardBack } from "../components/card.js";
import { useState, useEffect } from "react";
// routing
import { Link, useNavigate } from "react-router-dom";
// react-icons
import { LuChevronFirst, LuChevronLast, LuChevronLeft, LuChevronRight } from "react-icons/lu";
import { FaHeart } from "react-icons/fa";
// api fetch
import { useCardsInfinite } from "../services/pokemonQueries";
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
import { useAuth } from "../services/authContext.js";
import { arrayRemove, arrayUnion, doc, onSnapshot, updateDoc } from "firebase/firestore";
import { db } from "../services/firebase.js";

export default function Products() {
	const navigate = useNavigate();
	// user
	const { user } = useAuth();

	// query first 250 Pokemon cards
	const pageSize = 15;
	const maxPages = 20;
	const { data,
		fetchNextPage,
		refetch,
		isFetching,
		isLoading,
		isError,
		error } = useCardsInfinite(pageSize, maxPages);

	const [currentPageIndex, setCurrentPageIndex] = useState(0);

	// get data of current page
	const currentPage = data?.pages[currentPageIndex];
	const cards = currentPage?.data || [];
	const currentPageNumber = currentPage?.page ?? 1;

	// if user has fetched and cached data already, get total pages fetched - else, default to page 1
	const totalPages = currentPage ? Math.ceil(currentPage.totalCount / currentPage.pageSize) : 1;
	const cappedTotalPages = Math.min(totalPages, maxPages);
	// check if there are more pages to be fetched from API
	const hasMorePages = currentPageNumber < cappedTotalPages;
	const hasNextCachedPage = currentPageIndex < (data?.pages.length ?? 0) - 1;

	console.log("totalPages", totalPages);
	console.log("cappedTotalPages", cappedTotalPages);
	console.log("fetchedPages", data?.pages.length);

	// ui state
	const [grabbingCard, setGrabbingCard] = useState(null);
	const [flippedCards, setFlippedCards] = useState({});
	const [favCards, setFavCards] = useState([]);
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

	// update favorites according to user db
	useEffect(() => {
		// if not logged in, do not fetch
		if (!user) return;
		// get list of favorites and update heart icons
		const userRef = doc(db, "users", user.uid);
		const unsubscribe = onSnapshot(userRef, (snapshot) => {
			const data = snapshot.data();
			setFavCards(data?.favorites || []);
		});
		return () => unsubscribe();
	}, [user]);

	const toggleFav = async (card) => {
		if (!user) navigate("/login");

		const userRef = doc(db, "users", user.uid);
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

	// always start at page 1
	useEffect(() => {
		refetch({ pageParam: 1 }).then(() => setCurrentPageIndex(0));
	}, [refetch]);

	if (isLoading) { return (<h4 className="w-100 my-5 py-5 text-center">Stocking the store. Please wait...</h4>); }
	if (isError) { return (<h4 className="w-100 my-5 py-5 text-center">Error: {error.message}</h4>); }

	return (<div>
		<Pagination>
			<div className="btn-container d-flex justify-content-evenly align-items-center my-4">
				<Button variant="light" disabled={currentPageIndex === 0} onClick={() => setCurrentPageIndex(0)}>
					<LuChevronFirst size={16} color="black" style={{ marginBottom: "1.5px" }} /> Last
				</Button>
				<Button variant="light" disabled={currentPageIndex === 0}
					onClick={() => setCurrentPageIndex(Math.max(currentPageIndex - 1, 0))}>
					<LuChevronLeft size={16} color="black" style={{ marginBottom: "1.5px" }} /> Back
				</Button>

				{Array.from({ length: cappedTotalPages }, (_, i) => (
					<Button key={i} variant="light" className={currentPageNumber === i + 1 ? "current-page" : ""}
						disabled={isFetching && currentPageIndex === i}
						onClick={async () => {
							const totalFetched = data?.pages.length ?? 0;

							if (i < totalFetched) {
								// if cached, jump to
								setCurrentPageIndex(i);
								return;
							}
							if (i >= totalFetched) {
								let pageToFetch = totalFetched;
								// only keep fetching while more pages exist
								while (pageToFetch <= i) {
									if (hasMorePages) {
										await fetchNextPage();
									}
									pageToFetch++;
								}
								setCurrentPageIndex(i);
							}
						}}>
						{i + 1}
					</Button>
				))}


				<Button variant="light" disabled={(!hasNextCachedPage && !hasMorePages)}
					onClick={() => {
						if (hasNextCachedPage) {
							// go to cached page immediately
							setCurrentPageIndex(i => i + 1);
						} else if (hasMorePages) {
							setCurrentPageIndex(i => i + 1); // optimistically advance
							// fetch next page in background
							fetchNextPage();
						}
					}}>
					Next <LuChevronRight size={16} color="black" style={{ marginBottom: "1.5px" }} />
				</Button>
				<Button variant="light" disabled={currentPageNumber === cappedTotalPages}
					onClick={() => {
						// jump to the last cached page instantly
						setCurrentPageIndex(data.pages.length - 1);
						// then fetch remaining pages in background until last page
						const fetchRemaining = async () => {
							let hasMore = true;
							while (hasMore) {
								const res = await fetchNextPage();
								const lastFetched = res.data?.pages[res.data.pages.length - 1];
								if (!lastFetched) break;
								if (lastFetched.page >= cappedTotalPages) {
									hasMore = false;
									setCurrentPageIndex(res.data.pages.length - 1);
								}
							}
						};
						fetchRemaining();
					}}
				>
					Last <LuChevronLast size={16} color="black" style={{ marginBottom: "1.5px" }} />
				</Button>

			</div>
		</Pagination >

		<div className="products-grid">
			{isFetching && currentPageIndex === data.pages.length ?
				// if next page is fetching and user is currently at page being fetched
				(<h4 className="w-100 my-5 py-5 text-center">Fetching next page...</h4>) :
				// else, render cards
				(cards.map(card => {

					return (<Card key={card.id ?? card.name} className="product-card">
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
							{/* <div className="d-flex flex-row justify-content-between align-items-center m-0 p-0">
								<p className="seller-username m-0 p-0">Seller.username</p>
								<p className="m-0 p-0">
									<span className="price-value">{price}</span>
									<span className="price-tag">PHP</span>
								</p>
							</div> */}

							<div className="d-flex flex-row justify-content-between align-items-center my-1 p-0">
								<div className="d-flex flex-row justify-content-end align-items-end">
									<h4 className="card-name fw-bold my-0 px-0 py-1"
										style={{ maxWidth: `calc(222px - ${28 * (card.types.length || 0)}px)` }}
									>{card.name}</h4>
									{card.level && <p className="card-level ms-1 mx-2 my-0 px-0 py-1">Lvl {card.level}</p>}
								</div>
								<div className="d-flex flex-row justify-content-start align-items-center">
									{card.types?.map((type, i) => (
										<OverlayTrigger key={`${card.id}-type-${i}`} placement="left"
											overlay={<Tooltip id={`tooltip-${card.id}-${i}`}>{type}</Tooltip>} >
											<img alt={type} src={typeIcons[type]} width="28px"
												className="card-type p-0 m-0" />
										</OverlayTrigger>
									))}
								</div>
							</div>

							<hr className="my-1 p-0" />

							<div className="d-flex flex-row justify-content-between align-items-center">
								<p className="me-2 attribute-name">Set</p>
								<p className="custom-badge me-1"> {card.set.name} </p>
							</div>
							<div className="d-flex flex-row justify-content-between align-items-center">
								<p className="me-2 attribute-name">Artist</p>
								<p className="card-artist custom-badge me-1"> {card.artist} </p>
							</div>
							<div className="d-flex flex-row justify-content-between align-items-center">
								<p className="me-2 attribute-name">Rarity</p>
								<p className="custom-badge me-1"> {card.rarity || "Unknown"} </p>
							</div>
							<div className="d-flex flex-row justify-content-between align-items-center">
								<p className="me-2 attribute-name">Supertype</p>
								<p className="custom-badge me-1"> {card.supertype} </p>
							</div>
							<div className="d-flex flex-row justify-content-between align-items-center">
								<p className="me-2 attribute-name">Subtypes</p>
								<div className="d-flex flex-row justify-content-end">
									{card.subtypes?.map((subtype, i) => (
										<p key={`${card.id}-subtype-${i}`} className="custom-gradient-badge me-1">
											{subtype}
										</p>
									))}
								</div>
							</div>

							<div className="d-flex flex-row justify-content-center align-items-center mt-3 mb-1">
								{favCards.includes(card.id) ?
									<FaHeart onClick={() => toggleFav(card)} size={28} color="red" /> :
									<FaHeart onClick={() => toggleFav(card)} size={28} color="#0000003d" />}
								<Link to={`/explore/${card.id}`} state={{ card }} className="listings w-100 ms-2">
									<Button variant="outline-dark" className="w-100">View Listings</Button>
								</Link>
							</div>
						</div>
					</Card>);
				}))}
		</div>

		<Pagination className="my-5">
			<div className="btn-container d-flex justify-content-evenly align-items-center">
				<Button variant="light" disabled={currentPageIndex === 0} onClick={() => setCurrentPageIndex(0)}>
					<LuChevronFirst size={16} color="black" style={{ marginBottom: "1.5px" }} /> Last
				</Button>
				<Button variant="light" disabled={currentPageIndex === 0}
					onClick={() => setCurrentPageIndex(Math.max(currentPageIndex - 1, 0))}>
					<LuChevronLeft size={16} color="black" style={{ marginBottom: "1.5px" }} /> Back
				</Button>

				{Array.from({ length: cappedTotalPages }, (_, i) => (
					<Button key={i} variant="light" className={currentPageNumber === i + 1 ? "current-page" : ""}
						disabled={isFetching && currentPageIndex === i}
						onClick={async () => {
							const totalFetched = data?.pages.length ?? 0;

							if (i < totalFetched) {
								// if cached, jump to
								setCurrentPageIndex(i);
								return;
							}
							if (i >= totalFetched) {
								let pageToFetch = totalFetched;
								// only keep fetching while more pages exist
								while (pageToFetch <= i) {
									if (hasMorePages) {
										await fetchNextPage();
									}
									pageToFetch++;
								}
								setCurrentPageIndex(i);
							}
						}}>
						{i + 1}
					</Button>
				))}


				<Button variant="light" disabled={(!hasNextCachedPage && !hasMorePages)}
					onClick={() => {
						if (hasNextCachedPage) {
							// go to cached page immediately
							setCurrentPageIndex(i => i + 1);
						} else if (hasMorePages) {
							setCurrentPageIndex(i => i + 1); // optimistically advance
							// fetch next page in background
							fetchNextPage();
						}
					}}>
					Next <LuChevronRight size={16} color="black" style={{ marginBottom: "1.5px" }} />
				</Button>
				<Button variant="light" disabled={currentPageNumber === cappedTotalPages}
					onClick={() => {
						// jump to the last cached page instantly
						setCurrentPageIndex(data.pages.length - 1);
						// then fetch remaining pages in background until last page
						const fetchRemaining = async () => {
							let hasMore = true;
							while (hasMore) {
								const res = await fetchNextPage();
								const lastFetched = res.data?.pages[res.data.pages.length - 1];
								if (!lastFetched) break;
								if (lastFetched.page >= cappedTotalPages) {
									hasMore = false;
									setCurrentPageIndex(res.data.pages.length - 1);
								}
							}
						};
						fetchRemaining();
					}}
				>
					Last <LuChevronLast size={16} color="black" style={{ marginBottom: "1.5px" }} />
				</Button>

			</div>
		</Pagination >
	</div >);
}