import { useQuery, useInfiniteQuery } from "@tanstack/react-query";
import localforage from "localforage";
import api from "./api";

// fetch some amount of cards
export const useCards = (pageSize) => useQuery({
	queryKey: ["cards", pageSize],
	queryFn: async () => {
		// check if data is cached in localforage
		const cacheKey = `cards-${pageSize}`;
		const cacheData = await localforage.getItem(cacheKey);
		if (cacheData) {
			console.log(cacheKey, "fetched from localforage!");
			return cacheData;
		};

		// if not cached, fetch from API and cache
		const res = await api.get(`/cards?pageSize=${pageSize}`);
		const data = res.data.data;
		await localforage.setItem(cacheKey, data);
		return data;
	},
	staleTime: Infinity,
	cacheTime: Infinity,
});

// fetch all cards
export const useCardsAll = () => useQuery({
	queryKey: ["allCards"],
	queryFn: async () => {
		const cacheKey = `allCards`;
		const cacheData = await localforage.getItem(cacheKey);

		if (cacheData) {
			console.log(cacheKey, "fetched from localforage!");
			return cacheData;
		}

		let allCards = [];
		let page = 1;
		let hasMore = true;

		while (hasMore) {
			const res = await api.get(`/cards?page=${page}&pageSize=250`); // max allowed
			const { data, count, totalCount } = res.data;

			allCards = allCards.concat(data);

			if (allCards.length >= totalCount || count === 0) {
				hasMore = false;
			} else {
				page++;
			}
		}

		await localforage.setItem(cacheKey, allCards);
		return allCards;
	},
	staleTime: Infinity,
	cacheTime: Infinity,
});


// fetch all cards for infinite scroll
export const useCardsInfinite = (pageSize = 5) => useInfiniteQuery({
	queryKey: ["cards-infinite", pageSize],
	queryFn: async ({ pageParam = 1 }) => { // default page length = 1
		// check if data is cached in localforage
		const cacheKey = `cards-infinite-${pageParam}-${pageSize}`;
		const cacheData = await localforage.getItem(cacheKey);
		if (cacheData) {
			console.log(cacheKey, "fetched from localforage!");
			return cacheData;
		};

		// if not cached, fetch from API and cache
		const res = await api.get(`/cards?page=${pageParam}&pageSize=${pageSize}`);
		const data = res.data;
		await localforage.setItem(cacheKey, data);
		return data;
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
	staleTime: Infinity,
	cacheTime: Infinity,
});

// fetch card rarities
export const useRarities = () => useQuery({
	queryKey: ["rarities"],
	queryFn: async () => {
		// check if data is cached in localforage
		const cacheKey = `rarities`;
		const cacheData = await localforage.getItem(cacheKey);
		if (cacheData) {
			console.log(cacheKey, "fetched from localforage!");
			return cacheData;
		};

		// if not cached, fetch from API and cache
		const res = await api.get("/rarities");
		const data = res.data.data || res.data;
		await localforage.setItem(cacheKey, data);
		return data;
	},
	staleTime: Infinity,
	cacheTime: Infinity,
});

// card types
export const useTypes = () => useQuery({
	queryKey: ["types"],
	queryFn: async () => {
		// check if data is cached in localforage
		const cacheKey = `types`;
		const cacheData = await localforage.getItem(cacheKey);
		if (cacheData) {
			console.log(cacheKey, "fetched from localforage!");
			return cacheData;
		};

		// if not cached, fetch from API and cache
		const res = await api.get("/types");
		const data = res.data.data || res.data;
		await localforage.setItem(cacheKey, data);
		return data;
	},
	staleTime: Infinity,
	cacheTime: Infinity,
});

// card supertypes
export const useSupertypes = () => useQuery({
	queryKey: ["supertypes"],
	queryFn: async () => {
		// check if data is cached in localforage
		const cacheKey = `supertypes`;
		const cacheData = await localforage.getItem(cacheKey);
		if (cacheData) {
			console.log(cacheKey, "fetched from localforage!");
			return cacheData;
		};

		// if not cached, fetch from API and cache
		const res = await api.get("/supertypes");
		const data = res.data.data || res.data;
		await localforage.setItem(cacheKey, data);
		return data;
	},
	staleTime: Infinity,
	cacheTime: Infinity,
});

// card subtypes
export const useSubtypes = () => useQuery({
	queryKey: ["subtypes"],
	queryFn: async () => {
		// check if data is cached in localforage
		const cacheKey = `subtypes`;
		const cacheData = await localforage.getItem(cacheKey);
		if (cacheData) {
			console.log(cacheKey, "fetched from localforage!");
			return cacheData;
		};

		// if not cached, fetch from API and cache
		const res = await api.get("/subtypes");
		const data = res.data.data || res.data;
		await localforage.setItem(cacheKey, data);
		return data;
	},
	staleTime: Infinity,
	cacheTime: Infinity,
});

// card sets
export const useSets = () => useQuery({
	queryKey: ["sets"],
	queryFn: async () => {
		// check if data is cached in localforage
		const cacheKey = `sets`;
		const cacheData = await localforage.getItem(cacheKey);
		if (cacheData) {
			console.log(cacheKey, "fetched from localforage!");
			return cacheData;
		};

		// if not cached, fetch from API and cache
		const res = await api.get("/sets");
		const data = res.data.data || res.data;
		await localforage.setItem(cacheKey, data);
		return data;
	},
	staleTime: Infinity,
	cacheTime: Infinity,
});