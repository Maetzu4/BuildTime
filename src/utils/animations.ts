import { FadeInDown, FadeInUp } from "react-native-reanimated";

// Equivale a staggerChildren: 0.04 de Framer Motion
export const staggerFadeUp = (index: number) =>
  FadeInDown.delay(index * 40)
    .duration(250)
    .springify();

// Para pantallas completas al montar (sin índice)
export const fadeUp = FadeInDown.duration(300).springify();

// Para elementos que entran desde arriba (headers)
export const fadeDown = FadeInUp.duration(300).springify();
