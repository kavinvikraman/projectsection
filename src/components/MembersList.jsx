
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { Plus, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const getRoleColor = (role) => {
  switch (role) {
    case 'Owner':
      return 'bg-brand-purple text-white';
    case 'Editor':
      return 'bg-brand-blue text-white';
    case 'Viewer':
      return 'bg-gray-500 text-white';
    default:
      return 'bg-gray-200 text-gray-800';
  }
};

const MembersList = ({ members, onAddMember, onRemoveMember }) => {
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Viewer");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  
  const handleAddMember = () => {
    if (email) {
      onAddMember({
        id: Date.now().toString(),
        name: email.split('@')[0],
        email,
        role,
        avatar: null
      });
      setEmail("");
      setRole("Viewer");
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-5 mb-5">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold text-gray-800">Team Members</h2>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button size="sm">
              <Plus className="h-4 w-4 mr-1" />
              Add Member
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add Team Member</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium text-gray-700">
                  Email Address
                </label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="colleague@example.com"
                  type="email"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium text-gray-700">
                  Role
                </label>
                <Select value={role} onValueChange={setRole}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Owner">Owner</SelectItem>
                    <SelectItem value="Editor">Editor</SelectItem>
                    <SelectItem value="Viewer">Viewer</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleAddMember}>Add Team Member</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
      
      <div className="divide-y divide-gray-100">
        {members.map((member) => (
          <div key={member.id} className="flex items-center justify-between py-3">
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage src={member.avatar} alt={member.name} />
                <AvatarFallback className="bg-gray-200 text-gray-700">
                  {member.name.slice(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium text-gray-800">{member.name}</p>
                <p className="text-sm text-gray-500">{member.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <Badge className={`${getRoleColor(member.role)}`}>
                {member.role}
              </Badge>
              {member.role !== "Owner" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-gray-500 hover:text-red-500"
                  onClick={() => onRemoveMember(member.id)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MembersList;
