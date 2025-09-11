import { useState } from "react";

export default function useCardFilters() {
	// fetch api data from local storage
	const [rarities, setRarities] = useState(() => {
		const saved = localStorage.getItem("fetchedCardRarities");
		return saved ? JSON.parse(saved) : [];
	});
	const [types, setTypes] = useState(() => {
		const saved = localStorage.getItem("fetchedCardTypes");
		return saved ? JSON.parse(saved) : [];
	});
	const [sets, setSets] = useState(() => {
		const saved = localStorage.getItem("fetchedCardSets");
		return saved ? JSON.parse(saved) : [];
	});

	const filterList = [
		{ text: "Card Sets", list: sets },
		{ text: "Condition", list: ["Mint", "Secondhand"] },
		{ text: "Card Type", list: types },
		{ text: "Rarity", list: rarities },
	];

	return filterList;
}
