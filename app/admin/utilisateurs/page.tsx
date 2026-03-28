"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { 
  Users, 
  Search, 
  MoreVertical,
  Shield,
  UserX,
  Mail,
  Calendar,
  Filter
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

const users = [
  {
    id: 1,
    name: "Joel Mugisho",
    email: "joel.mugisho@plenitude.cd",
    role: "ADMIN",
    image: null,
    joinedAt: "2024-01-15",
    lastActive: "2026-03-28"
  },
  {
    id: 2,
    name: "Marie Kabongo",
    email: "marie.k@gmail.com",
    role: "USER",
    image: null,
    joinedAt: "2025-06-20",
    lastActive: "2026-03-27"
  },
  {
    id: 3,
    name: "David Mwamba",
    email: "david.mwamba@outlook.com",
    role: "USER",
    image: null,
    joinedAt: "2025-08-10",
    lastActive: "2026-03-28"
  },
  {
    id: 4,
    name: "Grace Mutombo",
    email: "grace.m@gmail.com",
    role: "USER",
    image: null,
    joinedAt: "2025-09-05",
    lastActive: "2026-03-25"
  },
  {
    id: 5,
    name: "Emmanuel Kasongo",
    email: "emmanuel.k@yahoo.com",
    role: "ADMIN",
    image: null,
    joinedAt: "2024-03-22",
    lastActive: "2026-03-28"
  },
  {
    id: 6,
    name: "Ruth Ilunga",
    email: "ruth.ilunga@gmail.com",
    role: "USER",
    image: null,
    joinedAt: "2025-11-18",
    lastActive: "2026-03-26"
  },
  {
    id: 7,
    name: "Joseph Tshimanga",
    email: "joseph.t@hotmail.com",
    role: "USER",
    image: null,
    joinedAt: "2026-01-08",
    lastActive: "2026-03-24"
  },
  {
    id: 8,
    name: "Esther Nkulu",
    email: "esther.n@gmail.com",
    role: "USER",
    image: null,
    joinedAt: "2026-02-14",
    lastActive: "2026-03-28"
  },
]

export default function AdminUsersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [roleFilter, setRoleFilter] = useState("all")

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesRole = roleFilter === "all" || user.role === roleFilter
    return matchesSearch && matchesRole
  })

  const adminCount = users.filter(u => u.role === "ADMIN").length
  const userCount = users.filter(u => u.role === "USER").length

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase()
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
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-lg bg-primary/10">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="text-2xl font-bold text-foreground">{users.length}</p>
                <p className="text-sm text-muted-foreground">Total utilisateurs</p>
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
                <p className="text-sm text-muted-foreground">Administrateurs</p>
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
                <p className="text-2xl font-bold text-foreground">{userCount}</p>
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
                <SelectItem value="USER">Membres</SelectItem>
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
                      <AvatarImage src={user.image || undefined} />
                      <AvatarFallback className="bg-primary/10 text-primary">
                        {getInitials(user.name)}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium text-foreground">{user.name}</p>
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
                      : "bg-muted text-muted-foreground"
                  }`}>
                    {user.role === "ADMIN" && <Shield className="h-3 w-3" />}
                    {user.role === "ADMIN" ? "Admin" : "Membre"}
                  </span>
                </div>

                {/* Join Date - Hidden on mobile */}
                <div className="hidden md:flex col-span-2 items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>{new Date(user.joinedAt).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
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
                      <DropdownMenuItem>
                        <Shield className="mr-2 h-4 w-4" />
                        {user.role === "ADMIN" ? "Retirer admin" : "Promouvoir admin"}
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
          </div>
        </CardContent>
      </Card>

      {/* Empty State */}
      {filteredUsers.length === 0 && (
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
