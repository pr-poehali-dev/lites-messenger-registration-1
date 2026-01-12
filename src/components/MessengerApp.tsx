import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import Icon from '@/components/ui/icon';
import { useToast } from '@/hooks/use-toast';

type User = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  status: 'online' | 'offline';
  lastSeen?: string;
  customName?: string;
};

type Group = {
  id: string;
  name: string;
  description: string;
  avatar: string;
  membersCount: number;
};

type Channel = {
  id: string;
  name: string;
  description: string;
  avatar: string;
  subscribersCount: number;
};

const INITIAL_CONTACTS: User[] = [
  { id: '1', name: 'Анна Смирнова', username: 'anna_s', avatar: '👩‍💼', status: 'online' },
  { id: '2', name: 'Иван Петров', username: 'ivan_p', avatar: '👨‍💻', status: 'offline', lastSeen: '2 часа назад' },
  { id: '3', name: 'Мария Иванова', username: 'maria_i', avatar: '👩‍🎨', status: 'online' },
];

const EMOJI_AVATARS = ['😊', '😎', '🚀', '🎨', '🌟', '🎭', '🎮', '🎸', '🌈', '⚡', '🔥', '💎'];

export default function MessengerApp() {
  const [activeTab, setActiveTab] = useState('chats');
  const [contacts, setContacts] = useState<User[]>(INITIAL_CONTACTS);
  const [groups, setGroups] = useState<Group[]>([]);
  const [channels, setChannels] = useState<Channel[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);
  const [showAddContactDialog, setShowAddContactDialog] = useState(false);
  const [showRenameDialog, setShowRenameDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCreateGroupDialog, setShowCreateGroupDialog] = useState(false);
  const [showCreateChannelDialog, setShowCreateChannelDialog] = useState(false);
  const [selectedContact, setSelectedContact] = useState<User | null>(null);
  const [newContactUsername, setNewContactUsername] = useState('');
  const [customName, setCustomName] = useState('');
  const [groupName, setGroupName] = useState('');
  const [groupDescription, setGroupDescription] = useState('');
  const [groupAvatar, setGroupAvatar] = useState('👥');
  const [channelName, setChannelName] = useState('');
  const [channelDescription, setChannelDescription] = useState('');
  const [channelAvatar, setChannelAvatar] = useState('📢');
  const { toast } = useToast();

  const handleAddContact = () => {
    if (!newContactUsername) return;
    
    const newContact: User = {
      id: Date.now().toString(),
      name: newContactUsername,
      username: newContactUsername.toLowerCase().replace(/\s+/g, '_'),
      avatar: EMOJI_AVATARS[Math.floor(Math.random() * EMOJI_AVATARS.length)],
      status: 'offline',
      lastSeen: 'только что'
    };
    
    setContacts([...contacts, newContact]);
    setNewContactUsername('');
    setShowAddContactDialog(false);
    toast({ title: 'Контакт добавлен', description: `${newContact.name} добавлен в ваши контакты` });
  };

  const handleRenameContact = () => {
    if (!selectedContact || !customName) return;
    
    setContacts(contacts.map(c => 
      c.id === selectedContact.id ? { ...c, customName } : c
    ));
    setCustomName('');
    setShowRenameDialog(false);
    toast({ title: 'Контакт переименован', description: 'Новое имя сохранено' });
  };

  const handleDeleteContact = () => {
    if (!selectedContact) return;
    
    setContacts(contacts.filter(c => c.id !== selectedContact.id));
    setShowDeleteDialog(false);
    toast({ title: 'Контакт удалён', description: `${selectedContact.customName || selectedContact.name} удалён из контактов` });
  };

  const handleCreateGroup = () => {
    if (!groupName) return;
    
    const newGroup: Group = {
      id: Date.now().toString(),
      name: groupName,
      description: groupDescription,
      avatar: groupAvatar,
      membersCount: 1
    };
    
    setGroups([...groups, newGroup]);
    setGroupName('');
    setGroupDescription('');
    setGroupAvatar('👥');
    setShowCreateGroupDialog(false);
    toast({ title: 'Группа создана', description: `${newGroup.name} успешно создана` });
  };

  const handleCreateChannel = () => {
    if (!channelName) return;
    
    const newChannel: Channel = {
      id: Date.now().toString(),
      name: channelName,
      description: channelDescription,
      avatar: channelAvatar,
      subscribersCount: 1
    };
    
    setChannels([...channels, newChannel]);
    setChannelName('');
    setChannelDescription('');
    setChannelAvatar('📢');
    setShowCreateChannelDialog(false);
    toast({ title: 'Канал создан', description: `${newChannel.name} успешно создан` });
  };

  const filteredContacts = contacts.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.username.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (contact.customName && contact.customName.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const filteredGroups = groups.filter(group => 
    group.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredChannels = channels.filter(channel =>
    channel.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-background">
      <div className="w-full md:w-96 border-r flex flex-col">
        <div className="p-4 border-b space-y-4">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Lites</h1>
            <div className="flex gap-2">
              <Dialog open={showPremiumDialog} onOpenChange={setShowPremiumDialog}>
                <DialogTrigger asChild>
                  <Button size="icon" variant="ghost" className="text-amber-500">
                    <Icon name="Crown" size={20} />
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Icon name="Crown" size={24} className="text-amber-500" />
                      Lites Premium
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div className="bg-gradient-to-r from-amber-500/10 to-amber-600/10 rounded-lg p-4">
                      <p className="text-2xl font-bold text-center mb-2">300 ₽ / месяц</p>
                      <p className="text-center text-sm text-muted-foreground">Полный доступ ко всем функциям</p>
                    </div>

                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <Icon name="Check" size={20} className="text-green-500 mt-0.5" />
                        <div>
                          <p className="font-semibold">Видеозвонки HD</p>
                          <p className="text-sm text-muted-foreground">Качество до 1080p</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Icon name="Check" size={20} className="text-green-500 mt-0.5" />
                        <div>
                          <p className="font-semibold">Безлимитные аудиозвонки</p>
                          <p className="text-sm text-muted-foreground">Без ограничений по времени</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Icon name="Check" size={20} className="text-green-500 mt-0.5" />
                        <div>
                          <p className="font-semibold">Расширенные настройки</p>
                          <p className="text-sm text-muted-foreground">Темы, стикеры и больше</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <Icon name="Check" size={20} className="text-green-500 mt-0.5" />
                        <div>
                          <p className="font-semibold">Приоритетная поддержка</p>
                          <p className="text-sm text-muted-foreground">Ответ в течение часа</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Button className="w-full" size="lg">
                        <Icon name="CreditCard" size={20} className="mr-2" />
                        Оплатить картой
                      </Button>
                      <Button className="w-full" size="lg" variant="outline">
                        <Icon name="Smartphone" size={20} className="mr-2" />
                        Оплатить через СБП
                      </Button>
                    </div>

                    <p className="text-xs text-center text-muted-foreground">
                      Подписка автоматически продлевается. Отменить можно в любой момент.
                    </p>
                  </div>
                </DialogContent>
              </Dialog>

              <Button size="icon" variant="ghost">
                <Icon name="Settings" size={20} />
              </Button>
            </div>
          </div>

          <div className="relative">
            <Icon name="Search" size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Поиск"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
          <TabsList className="w-full justify-start rounded-none border-b h-12 bg-transparent p-0">
            <TabsTrigger value="chats" className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              <Icon name="MessageCircle" size={18} className="mr-2" />
              Чаты
            </TabsTrigger>
            <TabsTrigger value="contacts" className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              <Icon name="Users" size={18} className="mr-2" />
              Контакты
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              <Icon name="Users2" size={18} className="mr-2" />
              Группы
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chats" className="flex-1 overflow-y-auto m-0">
            <div className="flex flex-col items-center justify-center h-full p-8 text-center">
              <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <Icon name="MessageCircle" size={40} className="text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Пока нет чатов</h3>
              <p className="text-muted-foreground text-sm mb-4">Начните общение с контактами</p>
              <Button onClick={() => setActiveTab('contacts')}>
                <Icon name="UserPlus" size={18} className="mr-2" />
                Найти контакты
              </Button>
            </div>
          </TabsContent>

          <TabsContent value="contacts" className="flex-1 overflow-y-auto m-0">
            <div className="p-4 border-b">
              <Button className="w-full" onClick={() => setShowAddContactDialog(true)}>
                <Icon name="UserPlus" size={18} className="mr-2" />
                Добавить контакт
              </Button>
            </div>
            <div className="divide-y">
              {filteredContacts.map((contact) => (
                <div key={contact.id} className="p-4 flex items-center gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarFallback className="text-2xl">{contact.avatar}</AvatarFallback>
                    </Avatar>
                    {contact.status === 'online' && (
                      <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="font-semibold">{contact.customName || contact.name}</p>
                    {contact.customName && (
                      <p className="text-xs text-muted-foreground">{contact.name}</p>
                    )}
                    <p className="text-sm text-muted-foreground">@{contact.username}</p>
                    <p className="text-xs text-muted-foreground">
                      {contact.status === 'online' ? (
                        <span className="text-green-500 flex items-center gap-1">
                          <span className="w-2 h-2 bg-green-500 rounded-full" />
                          онлайн
                        </span>
                      ) : (
                        <span>был(а) {contact.lastSeen}</span>
                      )}
                    </p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="icon" variant="ghost">
                        <Icon name="MoreVertical" size={18} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => {}}>
                        <Icon name="MessageCircle" size={16} className="mr-2" />
                        Написать
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {}}>
                        <Icon name="Phone" size={16} className="mr-2" />
                        Позвонить
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {}}>
                        <Icon name="Video" size={16} className="mr-2" />
                        Видеозвонок
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => {
                        setSelectedContact(contact);
                        setCustomName(contact.customName || '');
                        setShowRenameDialog(true);
                      }}>
                        <Icon name="Edit2" size={16} className="mr-2" />
                        Переименовать
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        className="text-destructive"
                        onClick={() => {
                          setSelectedContact(contact);
                          setShowDeleteDialog(true);
                        }}
                      >
                        <Icon name="Trash2" size={16} className="mr-2" />
                        Удалить
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="groups" className="flex-1 overflow-y-auto m-0">
            <div className="p-4 border-b space-y-2">
              <Button className="w-full" onClick={() => setShowCreateGroupDialog(true)}>
                <Icon name="Users2" size={18} className="mr-2" />
                Создать группу
              </Button>
              <Button className="w-full" variant="outline" onClick={() => setShowCreateChannelDialog(true)}>
                <Icon name="Radio" size={18} className="mr-2" />
                Создать канал
              </Button>
            </div>

            {groups.length === 0 && channels.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                  <Icon name="Users2" size={40} className="text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Нет групп и каналов</h3>
                <p className="text-muted-foreground text-sm">Создайте группу или канал</p>
              </div>
            ) : (
              <div className="divide-y">
                {filteredGroups.map((group) => (
                  <button
                    key={group.id}
                    className="w-full p-4 hover:bg-secondary/50 transition-colors text-left flex items-center gap-3"
                  >
                    <Avatar>
                      <AvatarFallback className="text-2xl">{group.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p className="font-semibold">{group.name}</p>
                      <p className="text-sm text-muted-foreground">{group.description}</p>
                      <p className="text-xs text-muted-foreground">{group.membersCount} участников</p>
                    </div>
                    <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                  </button>
                ))}
                {filteredChannels.map((channel) => (
                  <button
                    key={channel.id}
                    className="w-full p-4 hover:bg-secondary/50 transition-colors text-left flex items-center gap-3"
                  >
                    <Avatar>
                      <AvatarFallback className="text-2xl">{channel.avatar}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <p className="font-semibold">{channel.name}</p>
                        <Badge variant="secondary" className="text-xs">Канал</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{channel.description}</p>
                      <p className="text-xs text-muted-foreground">{channel.subscribersCount} подписчиков</p>
                    </div>
                    <Icon name="ChevronRight" size={20} className="text-muted-foreground" />
                  </button>
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      <div className="hidden md:flex flex-1 items-center justify-center bg-secondary/20">
        <div className="text-center space-y-4 p-8">
          <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <Icon name="MessageCircle" size={64} className="text-primary" />
          </div>
          <h2 className="text-3xl font-bold">Lites Messenger</h2>
          <p className="text-muted-foreground max-w-md">
            Выберите чат из списка или начните новый разговор с контактом
          </p>
        </div>
      </div>

      <Dialog open={showAddContactDialog} onOpenChange={setShowAddContactDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Добавить контакт</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="username">Username или номер телефона</Label>
              <Input
                id="username"
                placeholder="@username или +7..."
                value={newContactUsername}
                onChange={(e) => setNewContactUsername(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddContactDialog(false)}>
              Отмена
            </Button>
            <Button onClick={handleAddContact} disabled={!newContactUsername}>
              Добавить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showRenameDialog} onOpenChange={setShowRenameDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Переименовать контакт</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="customName">Новое имя</Label>
              <Input
                id="customName"
                placeholder="Введите имя"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Имя будет видно только вам
              </p>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRenameDialog(false)}>
              Отмена
            </Button>
            <Button onClick={handleRenameContact} disabled={!customName}>
              Сохранить
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Удалить контакт?</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedContact && (
                <>Вы действительно хотите удалить <strong>{selectedContact.customName || selectedContact.name}</strong> из контактов? История сообщений будет сохранена.</>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Отмена</AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteContact} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Удалить
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <Dialog open={showCreateGroupDialog} onOpenChange={setShowCreateGroupDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Создать группу</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="grid grid-cols-6 gap-2">
                {EMOJI_AVATARS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setGroupAvatar(emoji)}
                    className={`aspect-square rounded-lg text-2xl flex items-center justify-center transition-all ${
                      groupAvatar === emoji
                        ? 'bg-primary text-white ring-2 ring-primary'
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="groupName">Название группы</Label>
              <Input
                id="groupName"
                placeholder="Моя группа"
                value={groupName}
                onChange={(e) => setGroupName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="groupDescription">Описание</Label>
              <Textarea
                id="groupDescription"
                placeholder="О чём эта группа..."
                value={groupDescription}
                onChange={(e) => setGroupDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateGroupDialog(false)}>
              Отмена
            </Button>
            <Button onClick={handleCreateGroup} disabled={!groupName}>
              Создать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={showCreateChannelDialog} onOpenChange={setShowCreateChannelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Создать канал</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex justify-center">
              <div className="grid grid-cols-6 gap-2">
                {['📢', '📺', '🎬', '🎵', '📰', '💼', '🎨', '🎮', '⚽', '🍕', '✈️', '💡'].map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => setChannelAvatar(emoji)}
                    className={`aspect-square rounded-lg text-2xl flex items-center justify-center transition-all ${
                      channelAvatar === emoji
                        ? 'bg-primary text-white ring-2 ring-primary'
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="channelName">Название канала</Label>
              <Input
                id="channelName"
                placeholder="Мой канал"
                value={channelName}
                onChange={(e) => setChannelName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="channelDescription">Описание</Label>
              <Textarea
                id="channelDescription"
                placeholder="О чём этот канал..."
                value={channelDescription}
                onChange={(e) => setChannelDescription(e.target.value)}
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateChannelDialog(false)}>
              Отмена
            </Button>
            <Button onClick={handleCreateChannel} disabled={!channelName}>
              Создать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
