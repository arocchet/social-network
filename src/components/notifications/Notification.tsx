'use client'

import { useState, FC } from 'react'

/** Type des icônes possibles */
type IconType = 'chat' | 'shield' | 'lock'

/** Composant Icon */
const Icon: FC<{ type: IconType }> = ({ type }) => {
  switch (type) {
    case 'chat':
      return <span className="w-5 h-5 bg-blue-500 rounded-full inline-block" />
    case 'shield':
      return <span className="w-5 h-5 bg-green-500 rounded-full inline-block" />
    case 'lock':
      return <span className="w-5 h-5 bg-gray-500 rounded-full inline-block" />
    default:
      return null
  }
}

/** Structure d’une notification */
interface NotificationItem {
  id: number
  user: { name: string; avatarUrl: string }
  message: string
  icon: IconType
  time: string
  unread: boolean
  section: string
}

/** Données d’exemple */
const notifications: NotificationItem[] = [
  {
    id: 1,
    user: { name: 'Mii Nähh', avatarUrl: 'https://images.pexels.com/photos/7256656/pexels-photo-7256656.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load' },
    message: 'a partagé la publication de Pierre Banas.',
    icon: 'chat',
    time: '5 j',
    unread: false,
    section: 'Nouveau',
  },
  {
    id: 2,
    user: { name: 'Facebook', avatarUrl: 'https://images.pexels.com/photos/30939662/pexels-photo-30939662/free-photo-of-delicieuse-tartinade-de-houmous-aux-pois-chiches-et-au-citron.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load' },
    message: 'Nous avons détecté une nouvelle connexion…',
    icon: 'shield',
    time: '1 j',
    unread: true,
    section: 'Nouveau',
  },
  {
    id: 3,
    user: { name: 'Dany Donnio', avatarUrl: 'https://images.pexels.com/photos/30890367/pexels-photo-30890367.jpeg?auto=compress&cs=tinysrgb&w=600&lazy=load' },
    message: 'a publié une mise à jour.',
    icon: 'chat',
    time: '1 j',
    unread: false,
    section: 'Plus tôt',
  },
]

/** Composant principal */
export const Notification: FC = () => {
  const [filter, setFilter] = useState<'all' | 'unread'>('all')

  // Filtrer selon l’onglet sélectionné
  const filtered = notifications.filter(n => (filter === 'all' ? true : n.unread))

  // Regrouper par section
  const sections = Array.from(
    filtered.reduce((map, n) => {
      if (!map.has(n.section)) map.set(n.section, [])
      map.get(n.section)!.push(n)
      return map
    }, new Map<string, NotificationItem[]>())
  )

  return (
    <div className="max-w-5xl m-25 px-3 mx-auto bg-gray-800 text-white rounded-lg overflow-hidden">
      {/* En-tête */}
      <div className="px-5 py-4 flex items-center justify-between">
        <h2 className="text-xl font-bold">Notifications</h2>
        <button onClick={() => { /*fonction*/ }}>⋯</button>
      </div>

      {/* Onglets */}
      <div className="px-5 flex space-x-4 border-b border-gray-700">
        <button
          className={`py-2 ${filter === 'all' ? 'border-b-2 border-white' : 'text-gray-400'}`}
          onClick={() => setFilter('all')}
        >
          Tout
        </button>
        <button
          className={`py-2 ${filter === 'unread' ? 'border-b-2 border-white' : 'text-gray-400'}`}
          onClick={() => setFilter('unread')}
        >
          Non lu
        </button>
      </div>

      {/* Contenu des notifications */}
      <div className="px-5 py-4 space-y-6 max-h-[400px] overflow-y-auto">
        {sections.map(([sectionName, items]) => (
          <div key={sectionName}>
            <h3 className="uppercase text-sm font-semibold text-gray-400 mb-3">
              {sectionName}
            </h3>
            <ul className="space-y-4">
              {items.map(n => (
                <li key={n.id} className="flex items-start gap-3">
                  <img
                    src={n.user.avatarUrl}
                    alt={n.user.name}
                    className="w-10 h-10 rounded-full"
                  />
                  <div className="flex-1">
                    <p>
                      <strong>{n.user.name}</strong> {n.message}
                    </p>
                    <span className="text-xs text-gray-400">{n.time}</span>
                  </div>
                  <Icon type={n.icon} />
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div className="px-5 py-3 border-t border-gray-700 text-center">
        <button className="text-sm text-blue-400 hover:underline">
          Voir les notifications précédentes
        </button>
      </div>
    </div>
  )
}

export default Notification
