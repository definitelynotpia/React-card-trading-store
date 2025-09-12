import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import api from "./api";

// fetch some amount of cards
export const useCards = (pageSize) => useQuery({
	queryKey: ["cards", pageSize],
	queryFn: async () => {
		const res = await api.get(`/cards?pageSize=${pageSize}`);
		return res.data.data;
	}
});

// fetch all cards
export const useCardsAll = () => useQuery({
	queryKey: ["allCards"],
	queryFn: async () => { // default page length = 1
		const res = await api.get(`/cards?pageSize = 1`);
		return res.data.data;
	},
});

// fetch all cards for infinite scroll
export const useCardsInfinite = (pageSize = 5) => useInfiniteQuery({
	queryKey: ["cards"],
	queryFn: async ({ pageParam = 1 }) => { // default page length = 1
		const res = await api.get(`/cards?page=${pageParam}&pageSize=${pageSize}`);
		return res.data;
	},
	getNextPageParam: (lastPage, allPages) => {
		console.log("lastPage:", lastPage);
		if (lastPage.totalCount && lastPage.pageSize && lastPage.page) {
			// total pages = all cards / cards in page
			const totalPages = Math.ceil(lastPage.totalCount / lastPage.pageSize);
			return lastPage.page < totalPages ? lastPage.page + 1 : undefined;
		}
		// fallback: check if API returned items
		return lastPage.data.length > 0 ? allPages.length + 1 : undefined;
	},
});

// fetch card rarities
export const useRarities = () => useQuery({
	queryKey: ["rarities"],
	queryFn: async () => {
		const res = await api.get("/rarities");
		return res.data.data || res.data;
	},
});

// card types
export const useTypes = () => useQuery({
	queryKey: ["types"],
	queryFn: async () => {
		const res = await api.get("/types");
		return res.data.data || res.data;
	},
});

// card supertypes
export const useSupertypes = () => useQuery({
	queryKey: ["supertypes"],
	queryFn: async () => {
		const res = await api.get("/supertypes");
		return res.data.data || res.data;
	},
});

// card subtypes
export const useSubtypes = () => useQuery({
	queryKey: ["subtypes"],
	queryFn: async () => {
		const res = await api.get("/subtypes");
		return res.data.data || res.data;
	},
});

// card sets
export const useSets = () => useQuery({
	queryKey: ["sets"],
	queryFn: async () => {
		const res = await api.get("/sets");
		return res.data.data || res.data;
	},
});