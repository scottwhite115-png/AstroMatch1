import { redirect } from "next/navigation";

// Redirect to default topic page
export default function CommunityPage() {
  redirect("/community/general-astrology");
}
