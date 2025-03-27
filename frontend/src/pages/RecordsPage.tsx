import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { GrowthRecord } from "../models/growth";
import { WaterRecord } from "../models/water";
import { Unit } from "../models/unit";
import { api } from "../redux/api";

const RecordsPage = () => {


    return (
        <div className="page-container">
            Records Page
        </div>
    );
};

export default RecordsPage;