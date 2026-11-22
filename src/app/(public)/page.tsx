
import Banner from "@/components/home/Banner";
import WhyChoose from "@/components/home/WhyChoose";
import HowWorks from "@/components/home/HowWorks";
import Feature from "@/components/home/Feature";
import CategoryBasedData from "@/components/home/CategoryBasedData";

export default function Home() {
  return (
    <div>
      <Banner />
      <Feature></Feature>
      <CategoryBasedData></CategoryBasedData>
      <WhyChoose />
      <HowWorks />
    </div>
  );
}
