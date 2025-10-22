'use client';

import { updateUserOnboarding } from '@/app/[locale]/onboarding/actions';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
  OnboardingSchemaType,
  onboardingSchema,
  step1Schema,
  step2Schema,
  step3Schema,
} from '@/schema/onboarding';
import { zodResolver } from '@hookform/resolvers/zod';
import { Check, ChevronLeft, ChevronRight, Loader2, Upload, User, X } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const STEPS = [
  {
    id: 1,
    title: 'Personal Information',
    schema: step1Schema,
  },
  {
    id: 2,
    title: 'Preferences',
    schema: step2Schema,
  },
  {
    id: 3,
    title: 'Complete Setup',
    schema: step3Schema,
  },
];

export function OnboardingForm({ className, ...props }: React.ComponentProps<'div'>) {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);

  const t = useTranslations('Onboarding');
  const tStep1 = useTranslations('Onboarding.step1');
  const tStep2 = useTranslations('Onboarding.step2');
  const tStep3 = useTranslations('Onboarding.step3');
  const tNav = useTranslations('Onboarding.navigation');
  const tErrors = useTranslations('Onboarding.errors');
  const router = useRouter();
  const { data: session, update } = useSession();

  const form = useForm<OnboardingSchemaType>({
    resolver: zodResolver(onboardingSchema),
    defaultValues: {
      firstName: session?.user?.name ?? '',
      lastName: session?.user?.surname ?? '',
      company: '',
      role: 'developer',
      interests: [],
      experience: 'beginner',
      emailNotifications: true,
      pushNotifications: true,
      weeklyDigest: false,
      avatar: session?.user?.image ?? '',
      bio: '',
      timezone: '',
    },
  });

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setAvatarPreview(result);
        form.setValue('avatar', result);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeAvatar = () => {
    setAvatarPreview(null);
    form.setValue('avatar', '');
  };

  const nextStep = async () => {
    const currentSchema = STEPS[currentStep - 1].schema;
    const isValid = await form.trigger(Object.keys(currentSchema.shape));

    if (isValid) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const onSubmit = async (data: OnboardingSchemaType) => {
    setIsLoading(true);
    try {
      const response = await updateUserOnboarding(data);

      if (response.success) {
        await update({
          ...session,
          user: {
            ...session?.user,
            completedOnboarding: true,
          },
        });
        toast.success(t('successMessage'));
        router.push('/dashboard');
      } else {
        toast.error(response.error || tErrors('setupFailed'));
      }
    } catch (error) {
      console.error('Onboarding error:', error);
      toast.error(tErrors('setupFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <>
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">{tStep1('title')}</h1>
        <p className="text-muted-foreground text-sm mt-2">{tStep1('subtitle')}</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="firstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tStep1('firstName')}</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder={tStep1('firstNamePlaceholder')}
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{tStep1('lastName')}</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder={tStep1('lastNamePlaceholder')}
                  disabled={isLoading}
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="company"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{tStep1('company')}</FormLabel>
            <FormControl>
              <Input
                type="text"
                placeholder={tStep1('companyPlaceholder')}
                disabled={isLoading}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="role"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{tStep1('role')}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={tStep1('rolePlaceholder')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="developer">{tStep1('roles.developer')}</SelectItem>
                <SelectItem value="designer">{tStep1('roles.designer')}</SelectItem>
                <SelectItem value="manager">{tStep1('roles.manager')}</SelectItem>
                <SelectItem value="student">{tStep1('roles.student')}</SelectItem>
                <SelectItem value="entrepreneur">{tStep1('roles.entrepreneur')}</SelectItem>
                <SelectItem value="other">{tStep1('roles.other')}</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );

  const renderStep2 = () => (
    <>
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">{tStep2('title')}</h1>
        <p className="text-muted-foreground text-sm mt-2">{tStep2('subtitle')}</p>
      </div>
      <div>
        <FormLabel className="text-base font-medium">{tStep2('interests')}</FormLabel>
        <p className="text-sm text-muted-foreground mb-4">{tStep2('interestsSubtitle')}</p>
        <FormField
          control={form.control}
          name="interests"
          render={() => (
            <FormItem>
              <div className="grid grid-cols-2 gap-3">
                {[
                  'mindMapping',
                  'taskManagement',
                  'teamCollaboration',
                  'timeTracking',
                  'noteTaking',
                  'projectPlanning',
                ].map((item) => (
                  <FormField
                    key={item}
                    control={form.control}
                    name="interests"
                    render={({ field }) => (
                      <FormItem
                        key={item}
                        className="flex flex-row items-start space-x-3 space-y-0"
                      >
                        <FormControl>
                          <Checkbox
                            checked={field.value?.includes(item)}
                            onCheckedChange={(checked) => {
                              return checked
                                ? field.onChange([...field.value, item])
                                : field.onChange(field.value?.filter((value) => value !== item));
                            }}
                          />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">
                          {tStep2(`interestsOptions.${item}`)}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
      <FormField
        control={form.control}
        name="experience"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{tStep2('experience')}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={tStep2('experiencePlaceholder')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="beginner">{tStep2('experienceOptions.beginner')}</SelectItem>
                <SelectItem value="intermediate">
                  {tStep2('experienceOptions.intermediate')}
                </SelectItem>
                <SelectItem value="advanced">{tStep2('experienceOptions.advanced')}</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      <div>
        <FormLabel className="text-base font-medium">{tStep2('notifications')}</FormLabel>
        <FormDescription className="text-sm">{tStep2('notificationsSubtitle')}</FormDescription>
        <div className="space-y-3 mt-4">
          <FormField
            control={form.control}
            name="emailNotifications"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-sm">{tStep2('emailNotifications')}</FormLabel>
                </div>
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="pushNotifications"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-sm">{tStep2('pushNotifications')}</FormLabel>
                </div>
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="weeklyDigest"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-sm">{tStep2('weeklyDigest')}</FormLabel>
                </div>
                <FormControl>
                  <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      </div>
    </>
  );

  const renderStep3 = () => (
    <>
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight">{tStep3('title')}</h1>
        <p className="text-muted-foreground text-sm mt-2">{tStep3('subtitle')}</p>
      </div>
      <div className="flex flex-col items-center gap-4">
        <div className="relative">
          {avatarPreview ? (
            <div className="relative">
              <img
                src={avatarPreview}
                alt="Avatar preview"
                className="w-24 h-24 rounded-full object-cover border-2 border-border"
              />
              <button
                type="button"
                onClick={removeAvatar}
                className="absolute -top-2 -right-2 bg-destructive text-destructive-foreground rounded-full p-1 hover:bg-destructive/90"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="w-24 h-24 rounded-full bg-muted flex items-center justify-center border-2 border-dashed border-border">
              <User className="h-8 w-8 text-muted-foreground" />
            </div>
          )}
        </div>
        <div className="text-center">
          <label htmlFor="avatar-upload" className="cursor-pointer">
            <Button type="button" variant="outline" size="sm" asChild>
              <span>
                <Upload className="h-4 w-4 mr-2" />
                {avatarPreview ? tStep3('changeAvatar') : tStep3('uploadAvatar')}
              </span>
            </Button>
          </label>
          <input
            id="avatar-upload"
            type="file"
            accept="image/*"
            onChange={handleAvatarUpload}
            className="hidden"
          />
        </div>
      </div>
      <FormField
        control={form.control}
        name="bio"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{tStep3('bio')}</FormLabel>
            <FormControl>
              <Textarea
                placeholder={tStep3('bioPlaceholder')}
                className="resize-none"
                disabled={isLoading}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name="timezone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{tStep3('timezone')}</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value} disabled={isLoading}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder={tStep3('timezonePlaceholder')} />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                {[
                  'UTC-12', 'UTC-11', 'UTC-10', 'UTC-9', 'UTC-8', 'UTC-7', 'UTC-6', 'UTC-5', 'UTC-4', 'UTC-3', 'UTC-2', 'UTC-1', 'UTC+0', 'UTC+1', 'UTC+2', 'UTC+3', 'UTC+4', 'UTC+5', 'UTC+6', 'UTC+7', 'UTC+8', 'UTC+9', 'UTC+10', 'UTC+11', 'UTC+12'
                ].map(tz => <SelectItem key={tz} value={tz}>{tz}</SelectItem>)}
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn('flex flex-col gap-8', className)}
        {...props}
      >
        <div className="flex items-center justify-center gap-4">
          {STEPS.map((step) => (
            <div key={step.id} className="flex flex-col items-center gap-2">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-colors',
                  currentStep >= step.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted text-muted-foreground'
                )}
              >
                {currentStep > step.id ? <Check className="h-4 w-4" /> : step.id}
              </div>
              <span
                className={cn(
                  'text-xs text-center',
                  currentStep >= step.id ? 'text-primary' : 'text-muted-foreground'
                )}
              >
                {t(`steps.${step.id - 1}`)}
              </span>
            </div>
          ))}
        </div>

        <div className="space-y-6">
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}
        </div>

        <div className="flex gap-3">
          {currentStep > 1 && (
            <Button type="button" variant="outline" onClick={prevStep} disabled={isLoading}>
              <ChevronLeft className="h-4 w-4 mr-2" />
              {tNav('previous')}
            </Button>
          )}
          <div className="flex-1" />
          {currentStep < STEPS.length ? (
            <Button type="button" onClick={nextStep} disabled={isLoading}>
              {tNav('next')}
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {tNav('finish')}
            </Button>
          )}
        </div>
      </form>
    </Form>
  );
}
