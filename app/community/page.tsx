// app/community/page.tsx - Redirects to default topic

import { redirect } from "next/navigation";

// Redirect to default topic page
export default function CommunityPage() {
  redirect("/community/relationship");
}
