"use client"
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { deleteService } from "@/lib/actions/services";
import { Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function DeleteDialog({serviceId}:{serviceId:string}) {
  const router = useRouter()
  const handleDelete = async () =>{
    await deleteService(serviceId)
    router.push("/dashboard/vendor/services")
  }
  return (
    <Dialog>
      <form>
        <DialogTrigger
          render={
            <Button variant="destructive">
              <Trash2 aria-hidden="true" />
              Delete
            </Button>
          }
        />
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete Service</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this service? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose render={<Button variant="outline">Cancel</Button>} />
            <Button type="submit" onClick={handleDelete} variant="destructive">
              Delete Service
            </Button>
          </DialogFooter>
        </DialogContent>
      </form>
    </Dialog>
  );
}
