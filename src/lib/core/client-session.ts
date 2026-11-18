import { useSession } from "../auth-client"

export const useClientSession = () => {
  const { data: session, isPending } = useSession();
  return { session, isPending };
}
