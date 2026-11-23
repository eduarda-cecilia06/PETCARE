import React, { ReactNode } from 'react';
import {
  ActivityIndicator,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TextInputProps,
  StyleProp,
  View,
  ViewStyle,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors, radius, shadow } from './theme';
import { ESPECIE_EMOJI } from '../utils/format';


export type NavKey = 'home' | 'pets' | 'calendar' | 'events' | 'profile';

const NAV_ITEMS: { key: NavKey; label: string; emoji: string; path: string }[] = [
  { key: 'home', label: 'Início', emoji: '🏠', path: '/dashboard' },
  { key: 'pets', label: 'Pets', emoji: '🐾', path: '/pets' },
  { key: 'calendar', label: 'Agenda', emoji: '📅', path: '/calendar' },
  { key: 'events', label: 'Histórico', emoji: '📋', path: '/events' },
  { key: 'profile', label: 'Perfil', emoji: '👤', path: '/profile' },
];

export function BottomNav({ active }: { active: NavKey }) {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  return (
    <View style={[s.bottomNav, { paddingBottom: Math.max(insets.bottom, 8) }]}>
      {NAV_ITEMS.map((it) => {
        const on = it.key === active;
        return (
          <Pressable
            key={it.key}
            style={s.navItem}
            onPress={() => !on && router.replace(it.path as any)}
            accessibilityRole="button"
            accessibilityLabel={it.label}
          >
            <View style={[s.navIcon, on && s.navIconOn]}>
              <Text style={{ fontSize: 18 }}>{it.emoji}</Text>
            </View>
            <Text style={[s.navLabel, on && s.navLabelOn]}>{it.label}</Text>
          </Pressable>
        );
      })}
    </View>
  );
}


type ScreenProps = {
  title?: string;
  subtitle?: string;
  back?: boolean | (() => void);
  right?: ReactNode;
  nav?: NavKey;
  scroll?: boolean;
  center?: boolean;
  children: ReactNode;
  contentStyle?: ViewStyle;
};

export function Screen({ title, subtitle, back, right, nav, scroll = true, center, children, contentStyle }: ScreenProps) {
  const router = useRouter();
  const onBack = typeof back === 'function' ? back : () => (router.canGoBack() ? router.back() : router.replace('/dashboard' as any));

  return (
    <SafeAreaView style={s.screen} edges={nav ? ['top', 'left', 'right'] : ['top', 'left', 'right', 'bottom']}>
      {title ? (
        <View style={s.header}>
          <View style={s.headerSide}>
            {back ? (
              <Pressable onPress={onBack} hitSlop={10} style={s.backBtn}>
                <Text style={s.backTxt}>‹</Text>
              </Pressable>
            ) : null}
          </View>
          <View style={s.headerCenter}>
            <Text style={s.headerTitle} numberOfLines={1}>
              {title}
            </Text>
            {subtitle ? (
              <Text style={s.headerSub} numberOfLines={1}>
                {subtitle}
              </Text>
            ) : null}
          </View>
          <View style={[s.headerSide, { alignItems: 'flex-end' }]}>{right}</View>
        </View>
      ) : null}

      <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {scroll ? (
          // flex:1 no ScrollView é o que garante a rolagem funcionando
          <ScrollView
            style={{ flex: 1 }}
            contentContainerStyle={[s.scrollContent, center && { flexGrow: 1, justifyContent: 'center' }, contentStyle]}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[{ flex: 1 }, contentStyle]}>{children}</View>
        )}
      </KeyboardAvoidingView>

      {nav ? <BottomNav active={nav} /> : null}
    </SafeAreaView>
  );
}


export function Card({ children, style, onPress }: { children: ReactNode; style?: StyleProp<ViewStyle>; onPress?: () => void }) {
  if (onPress) {
    return (
      <Pressable onPress={onPress} style={({ pressed }) => [s.card, style, pressed && { opacity: 0.85 }]}>
        {children}
      </Pressable>
    );
  }
  return <View style={[s.card, style]}>{children}</View>;
}

type BtnProps = {
  label: string;
  onPress: () => void;
  variant?: 'primary' | 'outline' | 'danger' | 'soft' | 'ghost';
  loading?: boolean;
  disabled?: boolean;
  small?: boolean;
  style?: StyleProp<ViewStyle>;
};

export function Button({ label, onPress, variant = 'primary', loading, disabled, small, style }: BtnProps) {
  const v = btnVariants[variant];
  return (
    <Pressable
      onPress={onPress}
      disabled={loading || disabled}
      style={({ pressed }) => [
        s.btn,
        small && s.btnSmall,
        { backgroundColor: v.bg, borderColor: v.border },
        (disabled || loading) && { opacity: 0.6 },
        pressed && { opacity: 0.85 },
        style,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={v.fg} />
      ) : (
        <Text style={[s.btnTxt, small && { fontSize: 13 }, { color: v.fg }]}>{label}</Text>
      )}
    </Pressable>
  );
}

const btnVariants = {
  primary: { bg: colors.primary, fg: '#fff', border: colors.primary },
  outline: { bg: '#fff', fg: colors.primary, border: colors.primaryBorder },
  soft: { bg: colors.primarySoft, fg: colors.primaryDark, border: colors.primaryBorder },
  danger: { bg: colors.danger, fg: '#fff', border: colors.danger },
  ghost: { bg: 'transparent', fg: colors.textSoft, border: 'transparent' },
};

export function Field({ label, hint, style, ...rest }: TextInputProps & { label: string; hint?: string }) {
  return (
    <View style={s.fieldGroup}>
      <Text style={s.label}>{label}</Text>
      <TextInput
        placeholderTextColor={colors.muted}
        {...rest}
        style={[s.input, rest.multiline && { height: 90, paddingTop: 12, textAlignVertical: 'top' }, style]}
      />
      {hint ? <Text style={s.hint}>{hint}</Text> : null}
    </View>
  );
}

export function Chip({ label, active, onPress }: { label: string; active?: boolean; onPress?: () => void }) {
  return (
    <Pressable onPress={onPress} style={[s.chip, active && s.chipOn]}>
      <Text style={[s.chipTxt, active && s.chipTxtOn]}>{label}</Text>
    </Pressable>
  );
}

export function ChipRow({ children }: { children: ReactNode }) {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingRight: 8 }} style={{ flexGrow: 0 }}>
      {children}
    </ScrollView>
  );
}

export function Badge({ label, bg = colors.primarySoft, fg = colors.primaryDark }: { label: string; bg?: string; fg?: string }) {
  return (
    <View style={[s.badge, { backgroundColor: bg }]}>
      <Text style={[s.badgeTxt, { color: fg }]}>{label}</Text>
    </View>
  );
}

export function SectionTitle({ children, action }: { children: ReactNode; action?: ReactNode }) {
  return (
    <View style={s.sectionRow}>
      <Text style={s.sectionTitle}>{children}</Text>
      {action}
    </View>
  );
}

export function Empty({ emoji = '🐾', title, text, action }: { emoji?: string; title: string; text?: string; action?: ReactNode }) {
  return (
    <View style={s.empty}>
      <Text style={{ fontSize: 40, marginBottom: 8 }}>{emoji}</Text>
      <Text style={s.emptyTitle}>{title}</Text>
      {text ? <Text style={s.emptyTxt}>{text}</Text> : null}
      {action ? <View style={{ marginTop: 14, alignSelf: 'stretch' }}>{action}</View> : null}
    </View>
  );
}

export function Loading({ text }: { text?: string }) {
  return (
    <View style={{ paddingVertical: 40, alignItems: 'center' }}>
      <ActivityIndicator size="large" color={colors.primary} />
      {text ? <Text style={[s.hint, { marginTop: 10 }]}>{text}</Text> : null}
    </View>
  );
}

export function ErrorBox({ message, onRetry }: { message: string; onRetry?: () => void }) {
  return (
    <View style={s.errorBox}>
      <Text style={s.errorTxt}>{message}</Text>
      {onRetry ? <Button label="Tentar novamente" variant="outline" small onPress={onRetry} style={{ marginTop: 10 }} /> : null}
    </View>
  );
}

export function PetAvatar({ pet, size = 56 }: { pet: { nome?: string; especie?: string; foto?: string | null }; size?: number }) {
  const emoji = ESPECIE_EMOJI[(pet.especie || '').toUpperCase()] || '🐾';
  const uri = pet.foto && (pet.foto.startsWith('data:') || pet.foto.startsWith('http') || pet.foto.startsWith('file:')) ? pet.foto : null;
  return (
    <View style={[s.avatar, { width: size, height: size, borderRadius: size / 2 }]}>
      {uri ? <Image source={{ uri }} style={{ width: size, height: size }} /> : <Text style={{ fontSize: size * 0.48 }}>{emoji}</Text>}
    </View>
  );
}

export function Stat({ value, label, onPress }: { value: string | number; label: string; onPress?: () => void }) {
  return (
    <Card style={{ flex: 1, alignItems: 'center', paddingVertical: 14 }} onPress={onPress}>
      <Text style={s.statValue}>{value}</Text>
      <Text style={s.statLabel}>{label}</Text>
    </Card>
  );
}


const s = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.bg },
  header: {
    minHeight: 58,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    backgroundColor: colors.card,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  headerSide: { width: 76, justifyContent: 'center' },
  headerCenter: { flex: 1, alignItems: 'center' },
  headerTitle: { fontSize: 17, fontWeight: '700', color: colors.text },
  headerSub: { fontSize: 12, color: colors.muted, marginTop: 1 },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center' },
  backTxt: { fontSize: 26, lineHeight: 28, color: colors.primaryDark, fontWeight: '700', marginTop: -2 },
  scrollContent: { padding: 18, paddingBottom: 32 },

  card: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 16, marginBottom: 14, borderWidth: 1, borderColor: colors.border, ...shadow },

  btn: { height: 50, borderRadius: radius.md, alignItems: 'center', justifyContent: 'center', borderWidth: 1, paddingHorizontal: 18 },
  btnSmall: { height: 38, borderRadius: radius.sm, paddingHorizontal: 14 },
  btnTxt: { fontSize: 15, fontWeight: '700' },

  fieldGroup: { marginBottom: 14 },
  label: { fontSize: 13, fontWeight: '600', color: colors.textSoft, marginBottom: 6 },
  input: {
    height: 48,
    backgroundColor: colors.inputBg,
    borderRadius: radius.md,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    fontSize: 15,
    color: colors.text,
  },
  hint: { fontSize: 12, color: colors.muted, marginTop: 4 },

  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: radius.pill, backgroundColor: '#fff', borderWidth: 1, borderColor: colors.border, marginRight: 8 },
  chipOn: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipTxt: { fontSize: 13, color: colors.textSoft, fontWeight: '600' },
  chipTxtOn: { color: '#fff' },

  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: radius.pill, alignSelf: 'flex-start' },
  badgeTxt: { fontSize: 11, fontWeight: '700' },

  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 6, marginBottom: 10 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: colors.text },

  empty: { backgroundColor: '#fff', borderRadius: radius.lg, padding: 28, alignItems: 'center', borderWidth: 1, borderColor: colors.border },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: colors.text, textAlign: 'center' },
  emptyTxt: { fontSize: 13, color: colors.textSoft, textAlign: 'center', marginTop: 6, lineHeight: 19 },

  errorBox: { backgroundColor: colors.dangerSoft, borderRadius: radius.md, borderWidth: 1, borderColor: colors.dangerBorder, padding: 14, marginBottom: 14 },
  errorTxt: { color: '#991b1b', fontSize: 13, lineHeight: 19 },

  avatar: { backgroundColor: colors.primarySoft, alignItems: 'center', justifyContent: 'center', overflow: 'hidden', borderWidth: 1, borderColor: colors.primaryBorder },

  statValue: { fontSize: 24, fontWeight: '800', color: colors.primary },
  statLabel: { fontSize: 12, color: colors.textSoft, marginTop: 2, textAlign: 'center' },

  bottomNav: { flexDirection: 'row', backgroundColor: colors.card, borderTopWidth: 1, borderTopColor: colors.border, paddingTop: 6 },
  navItem: { flex: 1, alignItems: 'center' },
  navIcon: { width: 44, height: 28, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  navIconOn: { backgroundColor: colors.primarySoft },
  navLabel: { fontSize: 11, color: colors.muted, marginTop: 2, fontWeight: '600' },
  navLabelOn: { color: colors.primaryDark },
});
