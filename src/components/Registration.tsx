import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

const EMOJI_AVATARS = ['😊', '😎', '🚀', '🎨', '🌟', '🎭', '🎮', '🎸', '🌈', '⚡', '🔥', '💎'];

export default function Registration({ onComplete }: { onComplete: () => void }) {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState('');
  const [selectedEmoji, setSelectedEmoji] = useState('');
  const [uploadedPhoto, setUploadedPhoto] = useState('');
  const [nickname, setNickname] = useState('');
  const [username, setUsername] = useState('');

  const handlePhoneSubmit = () => {
    if (phone.length >= 10) setStep(2);
  };

  const handleAvatarSubmit = () => {
    if (selectedEmoji || uploadedPhoto) setStep(3);
  };

  const handleProfileSubmit = () => {
    if (nickname && username) setStep(4);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setUploadedPhoto(reader.result as string);
        setSelectedEmoji('');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-accent/5 p-4">
      <Card className="w-full max-w-md p-8 animate-fade-in">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Lites</h1>
          <p className="text-muted-foreground">Чистый дизайн. Простое общение.</p>
        </div>

        {step === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Phone" size={32} className="text-primary" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Ваш номер телефона</h2>
              <p className="text-muted-foreground text-sm">Введите номер для регистрации</p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Номер телефона</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+7 (999) 123-45-67"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="text-lg"
              />
            </div>

            <Button onClick={handlePhoneSubmit} className="w-full" size="lg">
              Продолжить
              <Icon name="ArrowRight" size={20} className="ml-2" />
            </Button>
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="Image" size={32} className="text-primary" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Выберите аватарку</h2>
              <p className="text-muted-foreground text-sm">Эмодзи или фото из галереи</p>
            </div>

            <div className="space-y-4">
              <div className="grid grid-cols-6 gap-3">
                {EMOJI_AVATARS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => {
                      setSelectedEmoji(emoji);
                      setUploadedPhoto('');
                    }}
                    className={`aspect-square rounded-xl text-3xl flex items-center justify-center transition-all hover:scale-110 ${
                      selectedEmoji === emoji
                        ? 'bg-primary text-white ring-4 ring-primary/20'
                        : 'bg-secondary hover:bg-secondary/80'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">или</span>
                </div>
              </div>

              <div>
                <Label htmlFor="photo" className="cursor-pointer">
                  <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary transition-colors">
                    {uploadedPhoto ? (
                      <img src={uploadedPhoto} alt="Preview" className="w-20 h-20 rounded-full mx-auto object-cover" />
                    ) : (
                      <>
                        <Icon name="Upload" size={32} className="mx-auto mb-2 text-muted-foreground" />
                        <p className="text-sm text-muted-foreground">Загрузить фото</p>
                      </>
                    )}
                  </div>
                </Label>
                <Input id="photo" type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setStep(1)} variant="outline" className="flex-1">
                <Icon name="ArrowLeft" size={20} className="mr-2" />
                Назад
              </Button>
              <Button onClick={handleAvatarSubmit} className="flex-1" disabled={!selectedEmoji && !uploadedPhoto}>
                Продолжить
                <Icon name="ArrowRight" size={20} className="ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-6">
            <div className="text-center">
              <Avatar className="w-20 h-20 mx-auto mb-4 text-3xl">
                {uploadedPhoto ? (
                  <img src={uploadedPhoto} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <AvatarFallback className="bg-primary/10 text-3xl">{selectedEmoji}</AvatarFallback>
                )}
              </Avatar>
              <h2 className="text-2xl font-semibold mb-2">Создайте профиль</h2>
              <p className="text-muted-foreground text-sm">Это имя увидят другие пользователи</p>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="nickname">Никнейм</Label>
                <Input
                  id="nickname"
                  placeholder="Ваше имя"
                  value={nickname}
                  onChange={(e) => setNickname(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="username">Username</Label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">@</span>
                  <Input
                    id="username"
                    placeholder="username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/[^a-z0-9_]/g, ''))}
                    className="pl-8"
                  />
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <Button onClick={() => setStep(2)} variant="outline" className="flex-1">
                <Icon name="ArrowLeft" size={20} className="mr-2" />
                Назад
              </Button>
              <Button onClick={handleProfileSubmit} className="flex-1" disabled={!nickname || !username}>
                Продолжить
                <Icon name="ArrowRight" size={20} className="ml-2" />
              </Button>
            </div>
          </div>
        )}

        {step === 4 && (
          <div className="space-y-6">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Icon name="CheckCircle2" size={32} className="text-green-500" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Всё готово!</h2>
              <p className="text-muted-foreground text-sm">Регистрация успешно завершена</p>
            </div>

            <div className="bg-secondary/50 rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-12 h-12 text-2xl">
                  {uploadedPhoto ? (
                    <img src={uploadedPhoto} alt="Avatar" className="w-full h-full object-cover" />
                  ) : (
                    <AvatarFallback className="bg-primary/10 text-2xl">{selectedEmoji}</AvatarFallback>
                  )}
                </Avatar>
                <div>
                  <p className="font-semibold">{nickname}</p>
                  <p className="text-sm text-muted-foreground">@{username}</p>
                </div>
              </div>
              <div className="text-sm text-muted-foreground">
                <Icon name="Phone" size={16} className="inline mr-2" />
                {phone}
              </div>
            </div>

            <Button onClick={onComplete} className="w-full" size="lg">
              Начать общение
              <Icon name="MessageCircle" size={20} className="ml-2" />
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              Уже есть аккаунт?{' '}
              <button className="text-primary hover:underline" onClick={onComplete}>
                Войти
              </button>
            </p>
          </div>
        )}

        <div className="flex justify-center gap-2 mt-8">
          {[1, 2, 3, 4].map((s) => (
            <div
              key={s}
              className={`h-2 rounded-full transition-all ${
                s === step ? 'w-8 bg-primary' : 'w-2 bg-muted'
              }`}
            />
          ))}
        </div>
      </Card>
    </div>
  );
}
