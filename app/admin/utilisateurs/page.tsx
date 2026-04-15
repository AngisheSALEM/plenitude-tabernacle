"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { 
  Users, 
  Search, 
  MoreVertical,
  Shield,
  UserX,
  Mail,
  Calendar,
  Filter,
  Mic
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/admin/users")
      const data = await res.json()
      if (data.users) {
        setUsers(data.users)
      }
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error)
      toast.error("Impossible de charger les utilisateurs")
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const handleUpdateRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch("/api/admin/users", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, role: newRole }),
      })

      if (res.ok) {
        toast.success("Rôle mis à jour")
        fetchUsers()
      } else {
        const data = await res.json()
        toast.error(data.error || "Erreur lors de la mise à jour")
      }
    } catch (error) {
      toast.error("Erreur réseau")
    }
  }

  const filteredUsers = users.filter(user => {
    const name = `${user.firstName} ${user.lastName}`.toLowerCase()
    const matchesSearch = name.includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const adminCount = users.filter(u => u.role === "ADMIN").length
  const preacherCount = users.filter(u => u.role === "PREDICATEUR").length
  const memberCount = users.filter(u => u.role === "MEMBRE").length

  const getInitials = (user: any) => {
    const f = user.firstName?.[0] || ""
    const l = user.lastName?.[0] || ""
    return (f + l).toUpperCase() || "U"
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-2xl font-serif font-bold text-foreground">
            Gestion des Utilisateurs
          </h2>
          <p className="text-muted-foreground">
            {users.length} utilisateurs inscrits
          </p>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{users.length}</p>
                <p className="text-sm text-muted-foreground">Total</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-blue-500/10">
                <Shield className="h-5 w-5 text-blue-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{adminCount}</p>
                <p className="text-sm text-muted-foreground">Admins</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-purple-500/10">
                <Mic className="h-5 w-5 text-purple-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{preacherCount}</p>
                <p className="text-sm text-muted-foreground">Prédicateurs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-green-500/10">
                <Users className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{memberCount}</p>
                <p className="text-sm text-muted-foreground">Membres</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card className="bg-card border-border">
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher un utilisateur..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-background border-border"
              />
            </div>
            <Select value={roleFilter} onValueChange={setRoleFilter}>
              <SelectTrigger className="w-full sm:w-48 bg-background border-border">
                <Filter className="mr-2 h-4 w-4" />
                <SelectValue placeholder="Role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous les roles</SelectItem>
                <SelectItem value="ADMIN">Administrateurs</SelectItem>
                <SelectItem value="PREDICATEUR">Prédicateurs</SelectItem>
                <SelectItem value="MEMBRE">Membres</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle>Liste des utilisateurs</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-8 text-center">Chargement...</div>
          ) : (
            <>
              {/* Table Header */}
              <div className="hidden md:grid grid-cols-12 gap-4 px-6 py-3 border-b border-border text-sm font-medium text-muted-foreground">
                <div className="col-span-4">Utilisateur</div>
                <div className="col-span-3">Email</div>
                <div className="col-span-2">Role</div>
                <div className="col-span-2">Inscription</div>
                <div className="col-span-1"></div>
              </div>

              {/* Users List */}
              <div className="divide-y divide-border">
                {filteredUsers.map((user, index) => (
                  <motion.div
                    key={user.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.2, delay: index * 0.03 }}
                    className="grid grid-cols-12 gap-4 px-6 py-4 items-center hover:bg-muted/50 transition-colors"
                  >
                    {/* User Info */}
                    <div className="col-span-12 md:col-span-4">
                      <div className="flex items-center gap-3">
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={user.avatar || undefined} />
                          <AvatarFallback className="bg-primary/10 text-primary">
                            {getInitials(user)}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground">{user.firstName} {user.lastName}</p>
                          <p className="text-sm text-muted-foreground md:hidden">{user.email}</p>
                        </div>
                      </div>
                    </div>

                    {/* Email - Hidden on mobile */}
                    <div className="hidden md:flex col-span-3 items-center gap-2 text-sm text-muted-foreground">
                      <Mail className="h-4 w-4 shrink-0" />
                      <span className="truncate">{user.email}</span>
                    </div>

                    {/* Role */}
                    <div className="hidden md:block col-span-2">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium ${
                        user.role === "ADMIN"
                          ? "bg-blue-500/10 text-blue-500"
                          : user.role === "PREDICATEUR"
                          ? "bg-purple-500/10 text-purple-500"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {user.role === "ADMIN" && <Shield className="h-3 w-3" />}
                        {user.role === "PREDICATEUR" && <Mic className="h-3 w-3" />}
                        {user.role === "ADMIN" ? "Admin" : user.role === "PREDICATEUR" ? "Prédicateur" : "Membre"}
                      </span>
                    </div>

                    {/* Join Date - Hidden on mobile */}
                    <div className="hidden md:flex col-span-2 items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(user.createdAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
                    </div>

                    {/* Actions */}
                    <div className="hidden md:flex col-span-1 justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Mail className="mr-2 h-4 w-4" />
                            Envoyer un email
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem onClick={() => handleUpdateRole(user.id, "ADMIN")}>
                            <Shield className="mr-2 h-4 w-4" />
                            Promouvoir Admin
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateRole(user.id, "PREDICATEUR")}>
                            <Mic className="mr-2 h-4 w-4" />
                            Promouvoir Prédicateur
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => handleUpdateRole(user.id, "MEMBRE")}>
                            <Users className="mr-2 h-4 w-4" />
                            Rendre Membre
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem className="text-destructive">
                            <UserX className="mr-2 h-4 w-4" />
                            Suspendre
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </motion.div>
                ))}
              </>
          )}
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {!isLoading && filteredUsers.length === 0 && (
        <Card className="bg-card border-border">
          <CardContent className="p-12 text-center">
            <Users className="h-12 w-12 text-muted-foreground mx-auto" />
            <h3 className="mt-4 text-lg font-semibold text-foreground">Aucun utilisateur trouve</h3>
            <p className="mt-2 text-muted-foreground">
              Modifiez vos filtres de recherche.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
