import "../App.css";
import "../styles/explore.css";
// icons
import { CgPokemon } from "react-icons/cg";
// utils
import GradientIcon from "../utils/gradientIcons.js";
// react
import { useState } from "react";
// components
import Products from "../components/productsList.js";
import { Dropdown } from "react-bootstrap";
// api
import { useRarities, useTypes, useSupertypes, useSubtypes, useSets } from "../services/pokemonQueries.js";

export default function Explore() {
    // const filterList = useCardFilters();
    const { data: rarities = [] } = useRarities();
    const { data: sets = [] } = useSets();
    const { data: types = [] } = useTypes();
    const { data: supertypes = [] } = useSupertypes();
    const { data: subtypes = [] } = useSubtypes();

    // set current tab
    const [activeTab, setActiveTab] = useState("singles");
    const tabList = [
        {
            eventKey: "singles",
            tabTitle: "Singles",
        },
        {
            eventKey: "sealedProducts",
            tabTitle: "Sealed Products",
        },
        {
            eventKey: "gradedCards",
            tabTitle: "Graded Cards",
        },
        {
            eventKey: "customLots",
            tabTitle: "Custom Lots",
        }
    ];

    if (!sets && !types && !supertypes && !subtypes && !rarities) { return (<>Loading filters...</>) }

    const filterList = [
        { text: "Card Set", list: sets },
        { text: "Condition", list: ["Mint", "Secondhand"] },
        { text: "Card Type", list: types },
        { text: "Card Supertype", list: supertypes },
        { text: "Card Subtype", list: subtypes },
        { text: "Rarity", list: rarities },
    ];

    return (<div className="content">
        <div className="d-flex flex-row justify-content-center align-items-center">
            <GradientIcon size={40} Icon={CgPokemon} />
            <h1 className="gradient-text h2 ms-2">Explore Cards</h1>
        </div>

        {false && <div className="tab-container d-flex justify-content-center align-items-center align-self-center my-2">
            {tabList.map((tab, id) => (
                <div
                    key={tab.eventKey}
                    title={tab.tabTitle}
                    onClick={() => setActiveTab(tab.eventKey)}
                    className={`tab ${id !== tabList.lastIndexOf ? "me-2" : ""} ${activeTab === tab.eventKey ? "active" : ""}`}
                >
                    {tab.tabTitle}
                </div>
            ))}

            <div className="d-flex flex-row justify-content-center align-items-center my-3">
                {filterList.map((filterItem, id) => (
                    <Dropdown key={id} >
                        <Dropdown.Toggle className={`filter-options ${id !== filterList.lastIndexOf ? "me-2" : ""}`}>
                            {filterItem.text}
                        </Dropdown.Toggle>

                        <Dropdown.Menu style={{ background: "#ffffffff" }}>
                            {filterItem.list.length > 10 && <input className="filter-search" placeholder="Search items..." />}

                            <div className="filter-list-container">
                                {filterItem.list.map((item, i) => {
                                    if (filterItem.list.length < 1) {
                                        return (<Dropdown.Item className="filter-list-item">
                                            Loading...
                                        </Dropdown.Item>);
                                    }
                                    return (
                                        <Dropdown.Item key={i} className="filter-list-item">
                                            {item.name || item}
                                        </Dropdown.Item>
                                    );
                                })}
                            </div>
                        </Dropdown.Menu>
                    </Dropdown>
                ))}
            </div>
        </div>}

        <div className="tab-content">
            <Products />
        </div>
    </div >);
}