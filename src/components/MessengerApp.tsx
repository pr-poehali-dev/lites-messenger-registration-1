import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';

type User = {
  id: string;
  name: string;
  username: string;
  avatar: string;
  status: 'online' | 'offline';
  lastSeen?: string;
};

type Chat = {
  id: string;
  user: User;
  lastMessage: string;
  time: string;
  unread: number;
};

const CONTACTS: User[] = [
  { id: '1', name: 'Анна Смирнова', username: 'anna_s', avatar: '👩‍💼', status: 'online' },
  { id: '2', name: 'Иван Петров', username: 'ivan_p', avatar: '👨‍💻', status: 'offline', lastSeen: '2 часа назад' },
  { id: '3', name: 'Мария Иванова', username: 'maria_i', avatar: '👩‍🎨', status: 'online' },
];

const INITIAL_CHATS: Chat[] = [];

export default function MessengerApp() {
  const [activeTab, setActiveTab] = useState('chats');
  const [chats] = useState<Chat[]>(INITIAL_CHATS);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPremiumDialog, setShowPremiumDialog] = useState(false);

  const filteredContacts = CONTACTS.filter(
    (contact) =>
      contact.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      contact.username.toLowerCase().includes(searchQuery.toLowerCase())
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
            <TabsTrigger value="profile" className="flex-1 rounded-none data-[state=active]:border-b-2 data-[state=active]:border-primary">
              <Icon name="User" size={18} className="mr-2" />
              Профиль
            </TabsTrigger>
          </TabsList>

          <TabsContent value="chats" className="flex-1 overflow-y-auto m-0">
            {chats.length === 0 ? (
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
            ) : (
              <div className="divide-y">
                {chats.map((chat) => (
                  <button
                    key={chat.id}
                    className="w-full p-4 hover:bg-secondary/50 transition-colors text-left flex items-center gap-3"
                  >
                    <div className="relative">
                      <Avatar>
                        <AvatarFallback className="text-2xl">{chat.user.avatar}</AvatarFallback>
                      </Avatar>
                      {chat.user.status === 'online' && (
                        <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-background rounded-full" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-start mb-1">
                        <p className="font-semibold truncate">{chat.user.name}</p>
                        <span className="text-xs text-muted-foreground">{chat.time}</span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">{chat.lastMessage}</p>
                    </div>
                    {chat.unread > 0 && (
                      <Badge className="rounded-full">{chat.unread}</Badge>
                    )}
                  </button>
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="contacts" className="flex-1 overflow-y-auto m-0">
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
                    <p className="font-semibold">{contact.name}</p>
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
                  <div className="flex gap-2">
                    <Button size="icon" variant="ghost">
                      <Icon name="MessageCircle" size={18} />
                    </Button>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="icon" variant="ghost" className="text-primary">
                          <Icon name="Phone" size={18} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Аудиозвонок</DialogTitle>
                        </DialogHeader>
                        <div className="text-center py-8 space-y-4">
                          <Avatar className="w-24 h-24 mx-auto text-5xl">
                            <AvatarFallback className="text-5xl">{contact.avatar}</AvatarFallback>
                          </Avatar>
                          <div>
                            <p className="font-semibold text-lg">{contact.name}</p>
                            <p className="text-sm text-muted-foreground">Вызов...</p>
                          </div>
                          <div className="flex justify-center gap-4 pt-8">
                            <Button size="icon" variant="destructive" className="w-16 h-16 rounded-full">
                              <Icon name="PhoneOff" size={24} />
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button size="icon" variant="ghost" className="text-primary">
                          <Icon name="Video" size={18} />
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-3xl">
                        <DialogHeader>
                          <DialogTitle>Видеозвонок</DialogTitle>
                        </DialogHeader>
                        <div className="text-center py-8 space-y-4">
                          <div className="bg-secondary rounded-lg aspect-video flex items-center justify-center">
                            <Avatar className="w-32 h-32 text-6xl">
                              <AvatarFallback className="text-6xl">{contact.avatar}</AvatarFallback>
                            </Avatar>
                          </div>
                          <div>
                            <p className="font-semibold text-lg">{contact.name}</p>
                            <p className="text-sm text-muted-foreground">Соединение...</p>
                          </div>
                          <div className="flex justify-center gap-4">
                            <Button size="icon" variant="outline" className="w-12 h-12 rounded-full">
                              <Icon name="Mic" size={20} />
                            </Button>
                            <Button size="icon" variant="outline" className="w-12 h-12 rounded-full">
                              <Icon name="Video" size={20} />
                            </Button>
                            <Button size="icon" variant="destructive" className="w-12 h-12 rounded-full">
                              <Icon name="PhoneOff" size={20} />
                            </Button>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="profile" className="flex-1 overflow-y-auto m-0">
            <div className="p-6 space-y-6">
              <div className="text-center">
                <Avatar className="w-24 h-24 mx-auto mb-4 text-5xl">
                  <AvatarFallback className="text-5xl">🚀</AvatarFallback>
                </Avatar>
                <h2 className="text-2xl font-bold">Мой профиль</h2>
                <p className="text-muted-foreground">@myusername</p>
                <div className="flex items-center justify-center gap-2 mt-2">
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="text-sm text-green-500">онлайн</span>
                </div>
              </div>

              <Card className="p-4 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon name="Phone" size={20} className="text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Телефон</p>
                      <p className="text-sm text-muted-foreground">+7 (999) 123-45-67</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Icon name="Edit2" size={16} />
                  </Button>
                </div>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Icon name="Mail" size={20} className="text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium">Email</p>
                      <p className="text-sm text-muted-foreground">user@example.com</p>
                    </div>
                  </div>
                  <Button size="sm" variant="ghost">
                    <Icon name="Edit2" size={16} />
                  </Button>
                </div>
              </Card>

              <div className="space-y-2">
                <Button className="w-full justify-between" variant="outline">
                  <span className="flex items-center gap-2">
                    <Icon name="Bell" size={18} />
                    Уведомления
                  </span>
                  <Icon name="ChevronRight" size={18} />
                </Button>
                <Button className="w-full justify-between" variant="outline">
                  <span className="flex items-center gap-2">
                    <Icon name="Shield" size={18} />
                    Приватность
                  </span>
                  <Icon name="ChevronRight" size={18} />
                </Button>
                <Button className="w-full justify-between" variant="outline">
                  <span className="flex items-center gap-2">
                    <Icon name="HelpCircle" size={18} />
                    Помощь
                  </span>
                  <Icon name="ChevronRight" size={18} />
                </Button>
              </div>

              <Button variant="destructive" className="w-full">
                <Icon name="LogOut" size={18} className="mr-2" />
                Выйти из аккаунта
              </Button>
            </div>
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
    </div>
  );
}
