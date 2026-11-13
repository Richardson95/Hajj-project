/** Photos in /public/images, matched to the places they show. Sources: public/images/CREDITS.md */
export interface Photo {
  src: string;
  alt: string;
  position?: string;
}

export const PHOTOS = {
  haram: { src: "/images/makkah-haram.jpg", alt: "Pilgrims in ihram around the Kaaba" },
  clockTower: {
    src: "/images/makkah-clock-tower.jpg",
    alt: "Pilgrims circling the Kaaba below the clock tower",
    position: "center 85%",
  },
  kiswah: { src: "/images/kaaba-kiswah.jpg", alt: "The Kaaba and its embroidered cover", position: "center 65%" },
  sai: { src: "/images/sai-masa.jpg", alt: "Pilgrims walking between Safa and Marwah", position: "center 60%" },
  arafat: { src: "/images/arafat.jpg", alt: "Pilgrims on Mount Arafat", position: "center 70%" },
  madinah: { src: "/images/madinah-courtyard.jpg", alt: "The courtyard of the Prophet's Mosque" },
  madinahDome: { src: "/images/madinah-dome.jpg", alt: "The Green Dome of the Prophet's Mosque" },
  madinahArches: { src: "/images/madinah-arches.jpg", alt: "Arches inside the Prophet's Mosque" },
} satisfies Record<string, Photo>;

/** Only chapters with a photo of the actual place get one. */
export const CHAPTER_PHOTOS: Partial<Record<string, Photo>> = {
  ihram: PHOTOS.haram,
  tawaf: PHOTOS.clockTower,
  sai: PHOTOS.sai,
  arafah: PHOTOS.arafat,
  madinah: PHOTOS.madinahDome,
};
