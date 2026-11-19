import GreenWaves from "@/assets/wallpapers/green_waves.webp.asset.json";
import GreenWavesThumb from "@/assets/wallpapers/green_waves_thumb.webp.asset.json";
import SamuraiSunset from "@/assets/wallpapers/samurai_sunset.webp.asset.json";
import SamuraiSunsetThumb from "@/assets/wallpapers/samurai_sunset_thumb.webp.asset.json";
import FlameSwirl from "@/assets/wallpapers/flame_swirl.webp.asset.json";
import FlameSwirlThumb from "@/assets/wallpapers/flame_swirl_thumb.webp.asset.json";
import SailingShip from "@/assets/wallpapers/sailing_ship.webp.asset.json";
import SailingShipThumb from "@/assets/wallpapers/sailing_ship_thumb.webp.asset.json";
import BlueAngle from "@/assets/wallpapers/blue_angle.webp.asset.json";
import BlueAngleThumb from "@/assets/wallpapers/blue_angle_thumb.webp.asset.json";
import StreetCar from "@/assets/wallpapers/street_car.webp.asset.json";
import StreetCarThumb from "@/assets/wallpapers/street_car_thumb.webp.asset.json";
import TigerCub from "@/assets/wallpapers/tiger_cub.webp.asset.json";
import TigerCubThumb from "@/assets/wallpapers/tiger_cub_thumb.webp.asset.json";
import ColorVortex from "@/assets/wallpapers/color_vortex.webp.asset.json";
import ColorVortexThumb from "@/assets/wallpapers/color_vortex_thumb.webp.asset.json";
import OrigamiBird from "@/assets/wallpapers/origami_bird.webp.asset.json";
import OrigamiBirdThumb from "@/assets/wallpapers/origami_bird_thumb.webp.asset.json";
import MoonWolf from "@/assets/wallpapers/moon_wolf.webp.asset.json";
import MoonWolfThumb from "@/assets/wallpapers/moon_wolf_thumb.webp.asset.json";

export type Wallpaper = { id: string; label: string; url: string; thumb: string };

/** Preset still wallpapers the user can pick in Appearance settings. */
export const WALLPAPERS: Wallpaper[] = [
  { id: "green_waves", label: "موجات خضراء", url: GreenWaves.url, thumb: GreenWavesThumb.url },
  { id: "samurai_sunset", label: "الساموراي", url: SamuraiSunset.url, thumb: SamuraiSunsetThumb.url },
  { id: "flame_swirl", label: "ألسنة اللهب", url: FlameSwirl.url, thumb: FlameSwirlThumb.url },
  { id: "sailing_ship", label: "السفينة", url: SailingShip.url, thumb: SailingShipThumb.url },
  { id: "blue_angle", label: "الزاوية الزرقاء", url: BlueAngle.url, thumb: BlueAngleThumb.url },
  { id: "street_car", label: "السيارة", url: StreetCar.url, thumb: StreetCarThumb.url },
  { id: "tiger_cub", label: "النمر الصغير", url: TigerCub.url, thumb: TigerCubThumb.url },
  { id: "color_vortex", label: "الدوامة الملونة", url: ColorVortex.url, thumb: ColorVortexThumb.url },
  { id: "origami_bird", label: "طائر الأوريغامي", url: OrigamiBird.url, thumb: OrigamiBirdThumb.url },
  { id: "moon_wolf", label: "ذئب القمر", url: MoonWolf.url, thumb: MoonWolfThumb.url },
];
