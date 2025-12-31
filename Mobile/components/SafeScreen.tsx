import { PropsWithChildren } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

type Props = PropsWithChildren<{
  edges?: ("top" | "bottom" | "left" | "right")[];
  style: {};
}>;

export default function SafeScreen({
  children,
  edges = ["top", "bottom"],
  style,
}: Props) {
  return (
    <SafeAreaView style={style} edges={edges}>
      {children}
    </SafeAreaView>
  );
}
