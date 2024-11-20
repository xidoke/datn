"use client";

import { useMemberStore } from "@/stores/member/memberStore";

const TestMemberPage = () => {
    const {workspaceMemberIds} = useMemberStore();
  return (
    <div>{workspaceMemberIds}</div>
  )
}
export default TestMemberPage