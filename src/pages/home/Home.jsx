import { Skeleton } from "antd";
import toast from "react-hot-toast";
import TrendingServices from "../services/trendind/trendingservices";
import Adsbanner from "../home/addbanner/AdsBanner";
import Categories from "./categories/Categories";
import BrandProducts from "./product carosel/BrandProducts";
import ValueProps from "./valu/ValueProps";
import LegacySection from "./LegacySection";
import "./Home.css";

export default function Home() {
  return (
    <div className="">
      {/* Top Banner */}

        <Adsbanner />
     

      {/* Categories */}
      <section className="home-section">
        <Categories toast={toast} />
      </section>

      {/* Trending Services */}
      <section className="home-section">
        <TrendingServices toast={toast} />
      </section>



      {/* Products by Brand */}
      <section className="home-container ">
        <BrandProducts />
      </section>

      {/* Value Proposition */}
      <section className="home-section">
        <ValueProps />
      </section>

      {/* Legacy Section */}
      <section className="home-section">
        <LegacySection />
      </section>
    </div>
  );
}
