'use client';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { FieldGroup } from '@/components/ui/field';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { OnboardingSchemaType } from '@/schema/onboarding';
import { Check, Loader2, Upload, User, X } from 'lucide-react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const STEPS = [
  { id: 1, title: 'Personal Information' },
  { id: 2, title: 'Preferences' },
  { id: 3, title: 'Complete Setup' },
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

  const form = useForm<OnboardingSchemaType>({
    defaultValues: {
      firstName: '',
      lastName: '',
      company: '',
      role: 'developer',
      interests: [],
      experience: 'beginner',
      emailNotifications: true,
      pushNotifications: true,
      weeklyDigest: false,
      avatar: '',
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
    let isValid = false;

    if (currentStep === 1) {
      isValid = await form.trigger(['firstName', 'lastName', 'role']);
    } else if (currentStep === 2) {
      isValid = await form.trigger(['interests', 'experience']);
    } else if (currentStep === 3) {
      isValid = await form.trigger(['timezone']);
    }

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
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      toast.success(tErrors('successMessage'));
      router.push('/dashboard');
    } catch (error) {
      console.error('Onboarding error:', error);
      toast.error(tErrors('setupFailed'));
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">{tStep1('title')}</h1>
        <p className="text-muted-foreground text-sm text-balance max-w-sm">{tStep1('subtitle')}</p>
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
            <FormControl>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoading}
                {...field}
              >
                <option value="">{tStep1('rolePlaceholder')}</option>
                <option value="developer">{tStep1('roles.developer')}</option>
                <option value="designer">{tStep1('roles.designer')}</option>
                <option value="manager">{tStep1('roles.manager')}</option>
                <option value="student">{tStep1('roles.student')}</option>
                <option value="entrepreneur">{tStep1('roles.entrepreneur')}</option>
                <option value="other">{tStep1('roles.other')}</option>
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );

  const renderStep2 = () => (
    <>
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">{tStep2('title')}</h1>
        <p className="text-muted-foreground text-sm text-balance max-w-sm">{tStep2('subtitle')}</p>
      </div>

      <div>
        <FormLabel className="text-base font-medium">{tStep2('interests')}</FormLabel>
        <p className="text-sm text-muted-foreground mb-4">{tStep2('interestsSubtitle')}</p>
        <FormField
          control={form.control}
          name="interests"
          render={({ field }) => (
            <FormItem>
              <div className="grid grid-cols-2 gap-3">
                {[
                  { key: 'mindMapping', label: tStep2('interestsOptions.mindMapping') },
                  { key: 'taskManagement', label: tStep2('interestsOptions.taskManagement') },
                  { key: 'teamCollaboration', label: tStep2('interestsOptions.teamCollaboration') },
                  { key: 'timeTracking', label: tStep2('interestsOptions.timeTracking') },
                  { key: 'noteTaking', label: tStep2('interestsOptions.noteTaking') },
                  { key: 'projectPlanning', label: tStep2('interestsOptions.projectPlanning') },
                ].map(({ key, label }) => (
                  <FormItem key={key} className="flex flex-row items-start space-x-3 space-y-0">
                    <FormControl>
                      <Checkbox
                        checked={field.value?.includes(key as any)}
                        onCheckedChange={(checked) => {
                          return checked
                            ? field.onChange([...field.value, key as any])
                            : field.onChange(field.value?.filter((value) => value !== key));
                        }}
                      />
                    </FormControl>
                    <FormLabel className="text-sm font-normal">{label}</FormLabel>
                  </FormItem>
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
            <FormControl>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoading}
                {...field}
              >
                <option value="">Select your experience level</option>
                <option value="beginner">{tStep2('experienceOptions.beginner')}</option>
                <option value="intermediate">{tStep2('experienceOptions.intermediate')}</option>
                <option value="advanced">{tStep2('experienceOptions.advanced')}</option>
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <div>
        <FormLabel className="text-base font-medium">{tStep2('notifications')}</FormLabel>
        <div className="space-y-3 mt-4">
          <FormField
            control={form.control}
            name="emailNotifications"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between">
                <div className="space-y-0.5">
                  <FormLabel className="text-sm font-normal">
                    {tStep2('emailNotifications')}
                  </FormLabel>
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
              <FormItem className="flex flex-row items-center justify-between">
                <div className="space-y-0.5">
                  <FormLabel className="text-sm font-normal">
                    {tStep2('pushNotifications')}
                  </FormLabel>
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
              <FormItem className="flex flex-row items-center justify-between">
                <div className="space-y-0.5">
                  <FormLabel className="text-sm font-normal">{tStep2('weeklyDigest')}</FormLabel>
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
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">{tStep3('title')}</h1>
        <p className="text-muted-foreground text-sm text-balance max-w-sm">{tStep3('subtitle')}</p>
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
                {avatarPreview ? tStep3('removeAvatar') : tStep3('uploadAvatar')}
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
              <textarea
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                placeholder={tStep3('bioPlaceholder')}
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
            <FormControl>
              <select
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                disabled={isLoading}
                {...field}
              >
                <option value="">{tStep3('timezonePlaceholder')}</option>
                <option value="UTC-12">UTC-12 (Baker Island)</option>
                <option value="UTC-11">UTC-11 (American Samoa)</option>
                <option value="UTC-10">UTC-10 (Hawaii)</option>
                <option value="UTC-9">UTC-9 (Alaska)</option>
                <option value="UTC-8">UTC-8 (Pacific Time)</option>
                <option value="UTC-7">UTC-7 (Mountain Time)</option>
                <option value="UTC-6">UTC-6 (Central Time)</option>
                <option value="UTC-5">UTC-5 (Eastern Time)</option>
                <option value="UTC-4">UTC-4 (Atlantic Time)</option>
                <option value="UTC-3">UTC-3 (Brazil)</option>
                <option value="UTC-2">UTC-2 (Mid-Atlantic)</option>
                <option value="UTC-1">UTC-1 (Azores)</option>
                <option value="UTC+0">UTC+0 (Greenwich)</option>
                <option value="UTC+1">UTC+1 (Central European)</option>
                <option value="UTC+2">UTC+2 (Eastern European)</option>
                <option value="UTC+3">UTC+3 (Moscow)</option>
                <option value="UTC+4">UTC+4 (Gulf)</option>
                <option value="UTC+5">UTC+5 (Pakistan)</option>
                <option value="UTC+6">UTC+6 (Bangladesh)</option>
                <option value="UTC+7">UTC+7 (Thailand)</option>
                <option value="UTC+8">UTC+8 (China)</option>
                <option value="UTC+9">UTC+9 (Japan)</option>
                <option value="UTC+10">UTC+10 (Australia)</option>
                <option value="UTC+11">UTC+11 (Solomon Islands)</option>
                <option value="UTC+12">UTC+12 (New Zealand)</option>
              </select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );

  return (
    <Form {...form}>
      <div className={cn('flex flex-col gap-6', className)} {...props}>
        {/* Progress indicator */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            {STEPS.map((step) => (
              <div key={step.id} className="flex items-center gap-2">
                <div
                  className={cn(
                    'w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium',
                    currentStep >= step.id
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {currentStep > step.id ? <Check className="h-4 w-4" /> : step.id}
                </div>
                {step.id < STEPS.length && (
                  <div
                    className={cn('w-8 h-0.5', currentStep > step.id ? 'bg-primary' : 'bg-muted')}
                  />
                )}
              </div>
            ))}
          </div>
          <span className="text-sm text-muted-foreground">
            {t('progress', { current: currentStep, total: STEPS.length })}
          </span>
        </div>

        <FieldGroup>
          {currentStep === 1 && renderStep1()}
          {currentStep === 2 && renderStep2()}
          {currentStep === 3 && renderStep3()}

          <div className="flex gap-3">
            {currentStep > 1 && (
              <Button
                type="button"
                variant="outline"
                onClick={prevStep}
                disabled={isLoading}
                className="flex-1"
              >
                {tNav('previous')}
              </Button>
            )}

            {currentStep < STEPS.length ? (
              <Button type="button" onClick={nextStep} disabled={isLoading} className="flex-1">
                {tNav('next')}
              </Button>
            ) : (
              <Button
                type="submit"
                onClick={form.handleSubmit(onSubmit)}
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {tNav('completing')}
                  </>
                ) : (
                  tNav('finish')
                )}
              </Button>
            )}
          </div>

          {currentStep < STEPS.length && (
            <div className="text-center">
              <Button
                type="button"
                variant="ghost"
                onClick={form.handleSubmit(onSubmit)}
                disabled={isLoading}
                className="text-sm text-muted-foreground"
              >
                {tNav('skip')}
              </Button>
            </div>
          )}
        </FieldGroup>
      </div>
    </Form>
  );
}
