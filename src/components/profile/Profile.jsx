"use client"

import React, { useEffect, useMemo, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"

const formatDate = (iso) => new Date(iso).toLocaleDateString()
const computeLongestStreak = (dates = []) => {
  if (!dates.length) return 0
  const days = [...new Set(dates.map(d => new Date(d).toDateString()))].map(d => new Date(d)).sort((a,b)=>a-b)
  let longest = 1, cur = 1
  for (let i=1;i<days.length;i++){ const diff = Math.round((days[i]-days[i-1])/(1000*60*60*24)); if(diff===1){cur++; longest=Math.max(longest,cur)} else cur=1 }
  return longest
}

const useLocal = (key, fallback) => {
  const [val, setVal] = useState(()=>{ try{ return JSON.parse(localStorage.getItem(key) || "null") ?? fallback }catch{return fallback} })
  useEffect(()=>{ try{ localStorage.setItem(key, JSON.stringify(val)) }catch(e){ console.error(e) } },[key,val])
  return [val, setVal]
}

export default function ProfilePage(){
  const navigate = useNavigate()
  const [isLoaded, setIsLoaded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  useEffect(()=>{ const t=setTimeout(()=>setIsLoaded(true),100); return ()=>clearTimeout(t) },[])

  const [profile, setProfile] = useLocal("profile", {
    name: "Pizza", username: "pizza_scores", bio: "Type fast. Eat pizza.", joined: new Date().toISOString(), avatarDataUrl: null, public: true
  })
  const [results] = useState(()=>{ try{ return JSON.parse(localStorage.getItem("typing_results")||"null") || [
    { date: new Date().toISOString(), mode: "Time (60s)", wpm: 88, accuracy: 96, words: 300 },
    { date: new Date(Date.now()-86400000).toISOString(), mode: "Words (50)", wpm: 75, accuracy: 92, words: 250 }
  ] }catch{return []} })

  const [draft, setDraft] = useState(profile)
  useEffect(()=>setDraft(profile),[profile])

  const stats = useMemo(()=>({
    totalTests: results.length,
    bestWPM: Math.max(...results.map(r=>r.wpm||0),0),
    avgAccuracy: results.length ? Math.round(results.reduce((s,r)=>s+(r.accuracy||0),0)/results.length) : 0,
    totalWords: results.reduce((s,r)=>s+(r.words||0),0),
    longestStreak: computeLongestStreak(results.map(r=>r.date))
  }),[results])

  // pagination settings
  const itemsPerPage = 2, maxItems = 5
  const visible = results.slice(0, maxItems)
  const [page, setPage] = useState(0)
  const totalPages = Math.max(1, Math.ceil(visible.length / itemsPerPage))
  useEffect(()=> setPage(0), [visible.length])

  const handleAvatarUpload = (e) => {
    const f = e.target.files?.[0]; if(!f || f.size > 5*1024*1024){ alert("Avatar too large — choose an image under 5MB"); return }
    const r = new FileReader(); r.onload = ()=> setDraft(d=>({ ...d, avatarDataUrl: r.result })); r.readAsDataURL(f)
  }
  const saveProfile = ()=>{ setProfile(draft); setIsEditing(false) }

  // small presentational components
  const StatCard = ({title, value}) => (
    <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
      <CardHeader className="pb-3"><CardTitle className="text-base text-gray-300 font-medium">{title}</CardTitle></CardHeader>
      <CardContent className="pt-0"><div className="text-3xl sm:text-4xl text-teal-300">{value}</div></CardContent>
    </Card>
  )

  const EditModal = ({open, onClose}) => {
    if(!open) return null
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-black/70" onClick={onClose} />
        <Card className="relative z-10 w-full max-w-2xl bg-gray-900/95 border-gray-700 backdrop-blur-lg">
          <CardHeader><CardTitle className="text-xl text-teal-300">Edit Profile</CardTitle></CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                {[{label:"Display name",k:"name"},{label:"Username",k:"username"},{label:"Bio",k:"bio",ta:true}].map(f=> (
                  <div key={f.k}>
                    <label className="block text-sm text-gray-300 mb-2">{f.label}</label>
                    {f.ta ? (
                      <textarea value={draft[f.k]||""} onChange={e=>setDraft(d=>({...d,[f.k]:e.target.value}))} className="w-full px-3 py-2 bg-black/30 border border-gray-600 rounded text-white h-20 resize-none" />
                    ) : (
                      <input value={draft[f.k]||""} onChange={e=>setDraft(d=>({...d,[f.k]:e.target.value}))} className="w-full px-3 py-2 bg-black/30 border border-gray-600 rounded text-white" />
                    )}
                  </div>
                ))}
              </div>

              <div>
                <label className="block text-sm text-gray-300 mb-2">Avatar</label>
                <div className="h-32 w-32 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center mb-4 ring-1 ring-gray-600">
                  {draft.avatarDataUrl ? <img src={draft.avatarDataUrl} alt="preview" className="h-full w-full object-cover"/> : <span className="text-gray-400">No image</span>} 
                </div>
                <div className="flex items-center gap-3">
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-teal-600 file:text-white hover:file:bg-teal-700" />
                  {draft.avatarDataUrl && <button type="button" onClick={()=>setDraft(d=>({...d,avatarDataUrl:null}))} className="px-3 py-2 text-sm rounded bg-red-600/70 text-white hover:bg-red-600 transition">Remove Image</button>}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button onClick={onClose} className="px-4 py-2 border border-white/20 rounded bg-black/30 text-gray-200 hover:bg-white/10 transition">Cancel</button>
              <Button onClick={saveProfile} className="bg-teal-600 hover:bg-teal-700">Save Changes</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className={`min-h-screen p-6 text-white transition-opacity duration-1000 ease-out ${isLoaded? 'opacity-100' : 'opacity-0'}`} style={{fontFamily: "'VT323', monospace", backgroundImage: 'url(/BG1.png)', backgroundSize:'cover', backgroundPosition:'center', backgroundAttachment:'fixed'}}>
      <div className="absolute inset-0 bg-black/50 z-0" />
      <div className={`relative z-10 max-w-6xl mx-auto space-y-6 transition-opacity duration-800 ease-out delay-200 ${isLoaded? 'opacity-100':'opacity-0'}`}>
        <div className="flex items-center justify-between mb-6 transition-opacity duration-800 ease-out delay-400">
          <div className="flex items-center gap-6">
            <div className="h-24 w-24 rounded-full bg-white/10 overflow-hidden flex items-center justify-center ring-2 ring-teal-400/50">{profile.avatarDataUrl? <img src={profile.avatarDataUrl} alt="avatar" className="h-full w-full object-cover"/> : <span className="text-2xl font-bold text-teal-300">{(profile.name||"?").slice(0,2).toUpperCase()}</span>}</div>
            <div>
              <h1 className="text-4xl font-bold text-teal-300 mb-1">{profile.name}</h1>
              <p className="text-gray-300 text-lg">@{profile.username}</p>
              <p className="text-gray-400 mt-2 max-w-md">{profile.bio}</p>
              <div className="flex gap-3 mt-3"><span className="px-3 py-1 bg-white/10 rounded-full text-sm">Joined {formatDate(profile.joined)}</span></div>
            </div>
          </div>

          <div className="flex gap-3">
            <Button onClick={()=>setIsEditing(true)} className="bg-teal-600 hover:bg-teal-700">Edit Profile</Button>
            <Button onClick={()=>navigate('/dashboard')} className="px-4 py-2 border border-teal-300/50 rounded bg-teal-300/20 text-teal-300 hover:bg-teal-300/30 transition">← Back to Dashboard</Button>
            <Button onClick={()=>{ const blob=new Blob([JSON.stringify({profile,stats},null,2)],{type:'application/json'}); const url=URL.createObjectURL(blob); const a=document.createElement('a'); a.href=url; a.download='profile-export.json'; a.click(); URL.revokeObjectURL(url) }} className="px-4 py-2 border border-teal-300/50 rounded bg-teal-300/20 text-teal-300 hover:bg-teal-300/30 transition">Export</Button>
          </div>
        </div>

        <div className={`grid grid-cols-5 gap-4 transition-opacity duration-800 ease-out delay-600 ${isLoaded? 'opacity-100':'opacity-0'}`}>
          {[
            ["Total Tests", stats.totalTests],
            ["Best WPM", stats.bestWPM],
            ["Avg Accuracy", `${stats.avgAccuracy}%`],
            ["Total Words", stats.totalWords],
            ["Longest Streak", `${stats.longestStreak} days`]
          ].map(([t,v],i)=> <StatCard key={i} title={t} value={v} />)}
        </div>

        <Card className={`bg-white/5 border-white/10 backdrop-blur-sm transition-opacity duration-800 ease-out delay-600 ${isLoaded? 'opacity-100':'opacity-0'}`}>
          <CardHeader><CardTitle className="text-xl text-gray-200">Recent Tests</CardTitle></CardHeader>
          <CardContent>
            <div className="overflow-hidden">
              <table className="w-full">
                <thead><tr className="border-b border-white/10">{["Date","Mode","WPM","Accuracy","Words"].map(h=> <th key={h} className="text-left py-3 text-sm text-gray-400 font-normal">{h}</th>)}</tr></thead>
                <tbody>{visible.slice(page*itemsPerPage,(page+1)*itemsPerPage).map((r,i)=> (
                  <tr key={i} className="border-b border-white/5 hover:bg-white/5 transition-colors"><td className="py-4 text-gray-300">{formatDate(r.date)}</td><td className="py-4 text-gray-300">{r.mode}</td><td className="py-4 font-medium text-white">{r.wpm}</td><td className="py-4 text-white">{r.accuracy}%</td><td className="py-4 text-gray-300">{r.words}</td></tr>
                ))}</tbody>
              </table>
            </div>
            <div className="flex items-center justify-between mt-4">
              <div className="text-sm text-gray-400">Showing {Math.min(visible.length,(page+1)*itemsPerPage)} of {visible.length}</div>
              <div className="flex gap-2">
                <button onClick={()=>setPage(p=>Math.max(0,p-1))} className="px-3 py-1 rounded bg-black/20 text-gray-200 hover:bg-white/5">Prev</button>
                <button onClick={()=>setPage(p=>Math.min(totalPages-1,p+1))} className="px-3 py-1 rounded bg-black/20 text-gray-200 hover:bg-white/5">Next</button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <EditModal open={isEditing} onClose={()=>setIsEditing(false)} />
    </div>
  )
}
