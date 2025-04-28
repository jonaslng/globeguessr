"use client";

import { Carousel } from "@/components/carousel";
import { Navbar } from "@/components/ui/navbar";

const test = [
  {
    src: "https://lh3.googleusercontent.com/p/AF1QipNlaRQANcoEyyGsvCFBcBcTC13tLrertKYh4y8j=w1080-h624-n-k-no",
    button: "Spielen",
    title: "Deutschland",
    link: "/game/germany_1"
  },
  {
    src: "https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcTOfE1YOIg9VOkM9R2Vv9SXVfEpCvT1GKf5V5s2MOrf9rT-Ytl-vto4YmXRoxPqnAIX59OF2KIIbRCaC54tQ-vab_JzLW9TX--39h3Bk24",
    button: "Spielen",
    title: "USA",
    link: "/game/usa_1"
  },
  {
    src: "https://encrypted-tbn0.gstatic.com/licensed-image?q=tbn:ANd9GcQpBgt9sY-Mczly-021fR_7kxzJ06vLL5tlo2pFdaMKTr0VsEtqr87mmk77bsQ_y-xlkDieqZuWKJaHdn4o03ue7hrJh1UaLnTW09oJ7A",
    button: "Spielen",
    title: "Frankreich",
    link: "/game/france_1"
  },
  {
    src: "https://encrypted-tbn3.gstatic.com/licensed-image?q=tbn:ANd9GcRjmu_875q-EgX7X6lYaS1IMHxBfuVVsLeI_gCVBYJvn6hRpkwMVqPRrrik2pCpPXLgZCYZm9ik8l2fBGjd_3Ey7hLbUifUx7KpKbxYWQ",
    button: "Spielen",
    title: "Italien",
    link: "/game/italy_1"
  }
]

export default function Home() {


  return (
    <div className="flex bg-[rgb(30,30,30)] items-center justify-center h-screen w-full">
      <Carousel slides={test} />
    </div>
  );
}