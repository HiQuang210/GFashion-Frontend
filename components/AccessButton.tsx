import { Link } from "expo-router";

import link from "@/styles/link";

type BtnProps = {
  route: string;
  content: string;
  color: string;
  background: string;
};

export default function AccessButton({
  route,
  content,
  background,
  color,
}: BtnProps) {
  return (
    <Link
      href={{ pathname: `/${route}` as any }}
      style={[
        link.btn_link,
        link.btn_link_base,
        {
          marginBottom: 20,
          backgroundColor: background,
          color: color,
        },
      ]}
    >
      {content}
    </Link>
  );
}
