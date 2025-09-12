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

// fetch all cards with pagination
export const useCardsAll = () => useInfiniteQuery({
	queryKey: ["cards"],
	queryFn: async ({ pageParam = 1 }) => { // default page length = 1
		const res = await api.get(`/cards?page=${pageParam}&pageSize=16`);
		return res.data;
	},
	getNextPageParam: (lastPage) => {
		if (lastPage.page < lastPage.totalPages) {
			return lastPage.page++;
		}
		return lastPage.page;
	},
	getPreviousPageParam: (firstPage) => {
		if (firstPage.page < firstPage.totalPages) {
			return firstPage.page++;
		}
		return firstPage.page;
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