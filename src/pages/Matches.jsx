import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import {
  Shield, Search, Users, Loader2, CheckCircle2, XCircle,
  Crown, UserPlus, LogOut, Trash2, Trophy
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function Teams() {
  const { user, profile } = useAuth()

  const [teamName, setTeamName] = useState('')
  const [searchIGN, setSearchIGN] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [allTeams, setAllTeams] = useState([])
  const [myTeam, setMyTeam] = useState(null)
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searching, setSearching] = useState(false)
  const [creating, setCreating] = useState(false)
  const [message, setMessage] = useState({ type: '', text: '' })

  useEffect(() => {
    if (!user) {
      setLoading(false)
      return
    }
    loadAll()
  }, [user?.id])

  const loadAll = async () => {
    if (!user) return
    setLoading(true)
    try {
      await Promise.all([loadMyTeam(), loadAllTeams()])
    } catch (err) {
      console.error('Load error:', err)
    } finally {
      setLoading(false)
    }
  }

  const loadMyTeam = async () => {
    if (!user) return
    const { data: membership } = await supabase
      .from('team_members')
      .select('team_id, role, teams(*)')
      .eq('player_id', user.id)
      .maybeSingle()

    if (membership?.teams) {
      setMyTeam({ ...membership.teams, myRole: membership.role })
      await loadTeamMembers(membership.team_id)
    } else {
      setMyTeam(null)
      setTeamMembers([])
    }
  }

  const loadTeamMembers = async (teamId) => {
    const { data } = await supabase
      .from('team_members')
      .select('role, joined_at, profiles(id, full_name, ign, ff_uid)')
      .eq('team_id', teamId)

    setTeamMembers(data || [])
  }

  const loadAllTeams = async () => {
    const { data } = await supabase
      .from('teams')
      .select('id, name, created_at, owner_id')
      .order('created_at', { ascending: false })
      .limit(20)

    setAllTeams(data || [])
  }

  const handleCreateTeam = async () => {
    if (!teamName.trim()) {
      setMessage({ type: 'error', text: 'Team name required' })
      return
    }
    if (myTeam) {
      setMessage({ type: 'error', text: 'You already have a team' })
      return
    }

    setCreating(true)
    setMessage({ type: '', text: '' })

    try {
      const { data: team, error: teamError } = await supabase
        .from('teams')
        .insert({ name: teamName.trim(), owner_id: user.id })
        .select()
        .single()

      if (teamError) throw teamError

      const { error: memberError } = await supabase
        .from('team_members')
        .insert({
          team_id: team.id,
          player_id: user.id,
          role: 'leader',
        })

      if (memberError) throw memberError

      setMessage({ type: 'success', text: `Team "${team.name}" created!` })
      setTeamName('')
      await loadAll()
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setCreating(false)
    }
  }

  const handleSearch = async () => {
    if (!searchIGN.trim()) return
    setSearching(true)
    setSearchResults([])

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('id, full_name, ign, ff_uid')
        .or(`ign.ilike.%${searchIGN}%,full_name.ilike.%${searchIGN}%`)
        .limit(10)

      if (error) throw error

      const filtered = (data || []).filter((p) => p.id !== user.id)
      setSearchResults(filtered)

      if (filtered.length === 0) {
        setMessage({ type: 'error', text: 'No players found' })
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    } finally {
      setSearching(false)
    }
  }

  const handleInvite = async (playerId) => {
    if (!myTeam) {
      setMessage({ type: 'error', text: 'Create a team first' })
      return
    }

    try {
      const { error } = await supabase.from('team_members').insert({
        team_id: myTeam.id,
        player_id: playerId,
        role: 'member',
      })

      if (error) throw error

      setMessage({ type: 'success', text: 'Player added to team!' })
      await loadTeamMembers(myTeam.id)
      setSearchResults([])
      setSearchIGN('')
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    }
  }

  const handleLeaveTeam = async () => {
    if (!myTeam) return

    if (myTeam.myRole === 'leader') {
      const confirmDelete = confirm(
        'You are the leader. Leaving will DELETE the team. Continue?'
      )
      if (!confirmDelete) return

      try {
        await supabase.from('team_members').delete().eq('team_id', myTeam.id)
        await supabase.from('teams').delete().eq('id', myTeam.id)

        setMessage({ type: 'success', text: 'Team deleted' })
        await loadAll()
      } catch (err) {
        setMessage({ type: 'error', text: err.message })
      }
    } else {
      if (!confirm('Leave this team?')) return

      try {
        await supabase
          .from('team_members')
          .delete()
          .eq('team_id', myTeam.id)
          .eq('player_id', user.id)

        setMessage({ type: 'success', text: 'Left team' })
        await loadAll()
      } catch (err) {
        setMessage({ type: 'error', text: err.message })
      }
    }
  }

  const handleRemoveMember = async (playerId) => {
    if (myTeam?.myRole !== 'leader') return
    if (!confirm('Remove this member?')) return

    try {
      await supabase
        .from('team_members')
        .delete()
        .eq('team_id', myTeam.id)
        .eq('player_id', playerId)

      setMessage({ type: 'success', text: 'Member removed' })
      await loadTeamMembers(myTeam.id)
    } catch (err) {
      setMessage({ type: 'error', text: err.message })
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 size={40} className="text-neonGold animate-spin" />
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-3 sm:px-6 py-6 sm:py-10">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-6 sm:mb-10"
      >
        <h1 className="font-display font-black text-3xl sm:text-4xl md:text-5xl italic tracking-wide">
          SQUAD <span className="neon-text-gold">MANAGEMENT</span>
        </h1>
        <p className="mt-2 sm:mt-3 text-xs sm:text-sm font-mono text-white/50 px-4">
          Build your team, invite players, dominate the battlefield
        </p>
      </motion.div>

      {/* Message */}
      {message.text && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mb-4 sm:mb-6 p-3 sm:p-4 rounded-md border flex items-center gap-2 sm:gap-3 ${
            message.type === 'success'
              ? 'border-green-500/40 bg-green-500/10'
              : 'border-red-500/40 bg-red-500/10'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 size={16} className="text-green-400 flex-shrink-0" />
          ) : (
            <XCircle size={16} className="text-red-400 flex-shrink-0" />
          )}
          <p
            className={`text-xs sm:text-sm font-mono ${
              message.type === 'success' ? 'text-green-400' : 'text-red-400'
            }`}
          >
            {message.text}
          </p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 sm:gap-6">

        {/* LEFT: Actions */}
        <div className="lg:col-span-1 space-y-4">

          {/* Create Team OR My Team Info */}
          {myTeam ? (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-4 sm:p-5 border-neonGold/40"
            >
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Crown size={14} className="text-neonGold sm:w-4 sm:h-4" />
                <h3 className="font-display font-bold text-[10px] sm:text-xs tracking-widest uppercase text-neonGold">
                  My Team
                </h3>
              </div>

              <div className="text-center py-2 sm:py-3">
                <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-neonGold/10 border-2 border-neonGold/40 flex items-center justify-center mx-auto mb-2 sm:mb-3">
                  <Shield size={24} className="text-neonGold sm:w-7 sm:h-7" />
                </div>
                <h4 className="font-display font-bold text-lg sm:text-xl text-white truncate">
                  {myTeam.name}
                </h4>
                <p className="text-[10px] sm:text-xs font-mono text-neonCyan mt-1 uppercase">
                  {myTeam.myRole}
                </p>
              </div>

              <button
                onClick={handleLeaveTeam}
                className="w-full mt-3 py-2 sm:py-2.5 rounded-md font-display font-bold text-[10px] sm:text-xs tracking-wider uppercase text-red-400 border border-red-500/40 hover:bg-red-500/10 transition flex items-center justify-center gap-2"
              >
                <LogOut size={12} />
                {myTeam.myRole === 'leader' ? 'Delete Team' : 'Leave Team'}
              </button>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="glass-card p-4 sm:p-5"
            >
              <div className="flex items-center gap-2 mb-3 sm:mb-4">
                <Shield size={14} className="text-neonGold sm:w-4 sm:h-4" />
                <h3 className="font-display font-bold text-[10px] sm:text-xs tracking-widest uppercase text-neonGold">
                  Create Team
                </h3>
              </div>

              <input
                type="text"
                value={teamName}
                onChange={(e) => setTeamName(e.target.value)}
                placeholder="Enter Team Name"
                maxLength={20}
                className="w-full px-3 py-2.5 rounded-md bg-black/60 border border-white/10 text-white text-sm font-mono placeholder-white/30 focus:outline-none focus:border-neonGold/60 transition"
              />

              <button
                onClick={handleCreateTeam}
                disabled={creating}
                className="w-full mt-3 py-2.5 rounded-md font-display font-bold text-[10px] sm:text-xs tracking-wider uppercase text-black bg-gradient-to-r from-neonGold to-gold hover:shadow-glow-gold transition disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {creating ? (
                  <>
                    <Loader2 size={12} className="animate-spin" /> Creating...
                  </>
                ) : (
                  <>
                    <Shield size={12} /> Create Team
                  </>
                )}
              </button>

              <p className="mt-2 sm:mt-3 text-[9px] sm:text-[10px] font-mono text-white/40 text-center">
                Team name max 20 characters
              </p>
            </motion.div>
          )}

          {/* Find Players */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="glass-card p-4 sm:p-5"
          >
            <div className="flex items-center gap-2 mb-3 sm:mb-4">
              <Search size={14} className="text-neonCyan sm:w-4 sm:h-4" />
              <h3 className="font-display font-bold text-[10px] sm:text-xs tracking-widest uppercase text-neonCyan">
                Find Players
              </h3>
            </div>

            <input
              type="text"
              value={searchIGN}
              onChange={(e) => setSearchIGN(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
              placeholder="Search IGN or name..."
              className="w-full px-3 py-2.5 rounded-md bg-black/60 border border-white/10 text-white text-sm font-mono placeholder-white/30 focus:outline-none focus:border-neonCyan/60 transition"
            />

            <button
              onClick={handleSearch}
              disabled={searching || !searchIGN.trim()}
              className="w-full mt-3 py-2.5 rounded-md font-display font-bold text-[10px] sm:text-xs tracking-wider uppercase text-black bg-gradient-to-r from-neonCyan to-neonBlue hover:shadow-glow-blue transition disabled:opacity-50 flex items-center justify-center gap-2"
            >
              {searching ? (
                <>
                  <Loader2 size={12} className="animate-spin" /> Searching...
                </>
              ) : (
                <>
                  <Search size={12} /> Search
                </>
              )}
            </button>

            {/* Search Results */}
            {searchResults.length > 0 && (
              <div className="mt-3 sm:mt-4 space-y-2 max-h-60 overflow-y-auto">
                <p className="text-[9px] sm:text-[10px] font-mono text-white/40 uppercase tracking-wider">
                  Results ({searchResults.length})
                </p>
                {searchResults.map((p) => (
                  <div
                    key={p.id}
                    className="p-2 sm:p-2.5 rounded-md bg-black/40 border border-white/10 hover:border-neonCyan/40 transition"
                  >
                    <div className="flex justify-between items-center gap-2">
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] sm:text-xs font-bold text-white truncate">
                          {p.ign || p.full_name || 'Unknown'}
                        </p>
                        {p.ign && p.full_name && (
                          <p className="text-[9px] sm:text-[10px] font-mono text-white/40 truncate">
                            {p.full_name}
                          </p>
                        )}
                      </div>
                      {myTeam && (
                        <button
                          onClick={() => handleInvite(p.id)}
                          title="Add to team"
                          className="p-1.5 rounded bg-neonCyan/10 border border-neonCyan/40 hover:bg-neonCyan/20 transition flex-shrink-0"
                        >
                          <UserPlus size={12} className="text-neonCyan" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        </div>

        {/* CENTER: Team Details OR Empty State */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="lg:col-span-2 glass-card p-5 sm:p-8 min-h-[400px] sm:min-h-[500px]"
        >
          {myTeam ? (
            <>
              <div className="text-center mb-6 sm:mb-8">
                <div className="w-16 h-16 sm:w-24 sm:h-24 rounded-full bg-gradient-to-br from-neonGold/20 to-neonCyan/20 border-2 border-neonGold/60 flex items-center justify-center mx-auto mb-3 sm:mb-4 shadow-glow-gold">
                  <Shield size={32} className="text-neonGold sm:w-12 sm:h-12" />
                </div>
                <h2 className="font-display font-black text-2xl sm:text-3xl italic text-white truncate">
                  {myTeam.name}
                </h2>
                <p className="text-[10px] sm:text-xs font-mono text-white/50 mt-1 sm:mt-2">
                  {teamMembers.length} / 4 members
                </p>
              </div>

              <div>
                <h3 className="font-display font-bold text-[10px] sm:text-xs tracking-widest uppercase text-neonCyan mb-3 sm:mb-4">
                  Team Roster
                </h3>

                <div className="space-y-2 sm:space-y-3">
                  {teamMembers.map((m) => (
                    <div
                      key={m.profiles?.id}
                      className="flex items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-md bg-black/40 border border-white/10 hover:border-neonGold/40 transition"
                    >
                      <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-neonGold/10 border border-neonGold/30 flex items-center justify-center flex-shrink-0">
                        {m.role === 'leader' ? (
                          <Crown size={14} className="text-neonGold sm:w-[18px] sm:h-[18px]" />
                        ) : (
                          <Users size={14} className="text-neonCyan sm:w-[18px] sm:h-[18px]" />
                        )}
                      </div>

                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-white text-xs sm:text-sm truncate">
                          {m.profiles?.ign || m.profiles?.full_name || 'Unknown'}
                        </p>
                        <p className="text-[9px] sm:text-[10px] font-mono text-white/40 uppercase">
                          {m.role}
                        </p>
                      </div>

                      {myTeam.myRole === 'leader' && m.role !== 'leader' && (
                        <button
                          onClick={() => handleRemoveMember(m.profiles?.id)}
                          className="p-1.5 sm:p-2 rounded hover:bg-red-500/10 transition flex-shrink-0"
                          title="Remove member"
                        >
                          <Trash2 size={12} className="text-red-400 sm:w-3.5 sm:h-3.5" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>

                {teamMembers.length < 4 && myTeam.myRole === 'leader' && (
                  <div className="mt-3 sm:mt-4 p-3 rounded-md border border-dashed border-white/10 text-center">
                    <p className="text-[10px] sm:text-xs font-mono text-white/40">
                      Search players to add ({4 - teamMembers.length} slots left)
                    </p>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center h-full py-12 sm:py-16">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-4 sm:mb-6">
                <Shield size={32} className="text-white/30 sm:w-10 sm:h-10" />
              </div>
              <h2 className="font-display font-bold italic text-xl sm:text-2xl text-white text-center">
                No Team Yet
              </h2>
              <p className="mt-2 sm:mt-3 text-xs sm:text-sm font-mono text-white/50 text-center max-w-sm px-4">
                Create your team, invite players, and join tournaments together.
              </p>
            </div>
          )}
        </motion.div>

        {/* RIGHT: All Teams */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-1 glass-card p-4 sm:p-5"
        >
          <div className="flex items-center gap-2 mb-3 sm:mb-4">
            <Trophy size={14} className="text-neonCyan sm:w-4 sm:h-4" />
            <h3 className="font-display font-bold text-[10px] sm:text-xs tracking-widest uppercase text-neonCyan">
              Active Teams ({allTeams.length})
            </h3>
          </div>

          {allTeams.length === 0 ? (
            <p className="text-[10px] sm:text-xs font-mono text-white/40 text-center py-6">
              No teams yet
            </p>
          ) : (
            <ul className="space-y-2 max-h-[500px] overflow-y-auto">
              {allTeams.map((t) => (
                <li
                  key={t.id}
                  className="p-2.5 sm:p-3 rounded-md border border-white/10 hover:border-neonCyan/50 transition"
                >
                  <div className="flex items-center gap-2">
                    <Shield size={12} className="text-neonCyan flex-shrink-0 sm:w-3.5 sm:h-3.5" />
                    <p className="text-xs sm:text-sm font-bold text-white truncate">
                      {t.name}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </motion.div>
      </div>

    </div>
  )
}