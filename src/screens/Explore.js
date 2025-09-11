import "../App.css";
import "../styles/explore.css";
// icons
import { RiMenuSearchLine } from 'react-icons/ri';
import { CgPokemon } from "react-icons/cg";
// utils
import GradientIcon from "../utils/gradientIcons.js";
import useCardFilters from "../utils/pokemonTcgData.js"
// react
import { useState } from "react";
// components
import Products from "../components/productsList.js";
import { Dropdown } from "react-bootstrap";

export default function Explore({ cards }) {
    const filterList = useCardFilters();
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

    return (<div className="content">
        <div className="d-flex flex-row align-items-center my-3">
            <GradientIcon size={35} Icon={RiMenuSearchLine} />
            <h1 className="gradient-text h2 ms-1">Explore</h1>
        </div>

        <div className="tab-container d-flex justify-content-start align-items-center align-self-center my-2">
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
        </div>

        <div className="d-flex flex-row justify-content-start align-items-center my-3">
            {filterList.map((filterItem, id) => (
                <Dropdown key={id} >
                    <Dropdown.Toggle className={`filter-options ${id !== filterList.lastIndexOf ? "me-3" : ""}`}>
                        {filterItem.text}
                    </Dropdown.Toggle>

                    <Dropdown.Menu className="filter-list-container">
                        {filterItem.list.map((item, i) => {
                            console.log(item.name || item);
                            return (
                                <Dropdown.Item key={i} className="filter-list-item">
                                    {item.name || item}
                                </Dropdown.Item>
                            );
                        })}
                    </Dropdown.Menu>
                </Dropdown>
            ))}
        </div>

        <div className="tab-content mx-4">
            <div className="d-flex flex-row align-items-center my-3">
                <GradientIcon size={35} Icon={CgPokemon} />
                <h1 className="gradient-text h2 ms-1">Featured Cards</h1>
            </div>

            <Products cards={cards} />
        </div>
    </div >);
}