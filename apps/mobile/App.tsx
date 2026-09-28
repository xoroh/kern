import {
  Badge,
  Button,
  Card,
  Checkbox,
  Chip,
  Divider,
  FieldMessage,
  Input,
  ListItem,
  RadioGroup,
  RadioItem,
  Switch,
  Text as KernText,
  useKernTheme,
  type Mode,
} from "@xoroh/kern/native";
import { StatusBar } from "expo-status-bar";
import { useState, type ReactNode } from "react";
import { SafeAreaView, ScrollView, View } from "react-native";

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <View style={{ gap: 8, paddingVertical: 8 }}>
      <KernText variant="title">{title}</KernText>
      {children}
    </View>
  );
}

export default function App() {
  const [mode, setMode] = useState<Mode>("light");
  const { scheme } = useKernTheme({ mode });
  const [checked, setChecked] = useState(false);
  const [on, setOn] = useState(false);
  const [plan, setPlan] = useState("free");
  const [selected, setSelected] = useState(false);
  const [email, setEmail] = useState("");

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: scheme.surface }}
    >
      <StatusBar style={mode === "dark" ? "light" : "dark"} />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 8 }}>
        <KernText variant="headline">Kern</KernText>
        <KernText variant="body">
          Native showcase — every component, live on theme tokens.
        </KernText>
        <Button
          variant="tonal"
          label={mode === "light" ? "Switch to dark" : "Switch to light"}
          onPress={() => setMode(mode === "light" ? "dark" : "light")}
        />
        <Divider />

        <Section title="Buttons">
          <Button label="Primary" onPress={() => {}} />
          <Button variant="tonal" label="Tonal" onPress={() => {}} />
          <Button variant="ghost" label="Ghost" onPress={() => {}} />
        </Section>
        <Divider />

        <Section title="Text">
          <KernText variant="headline">Headline</KernText>
          <KernText variant="title">Title</KernText>
          <KernText variant="body">Body copy.</KernText>
          <KernText variant="label">Label</KernText>
        </Section>
        <Divider />

        <Section title="Fields">
          <Input placeholder="Email" value={email} onChangeText={setEmail} />
          <Input placeholder="With error" error />
          <FieldMessage>Email never leaves this device.</FieldMessage>
          <FieldMessage variant="error">Enter a valid email.</FieldMessage>
        </Section>
        <Divider />

        <Section title="Selection">
          <Checkbox label="Accept terms" value={checked} onValueChange={setChecked} />
          <Switch value={on} onValueChange={setOn} />
          <RadioGroup value={plan} onValueChange={setPlan}>
            <RadioItem value="free" label="Free" />
            <RadioItem value="pro" label="Pro" />
          </RadioGroup>
          <Chip label="Assist" />
          <Chip
            variant="filter"
            label="Filter"
            selected={selected}
            onPress={() => setSelected(!selected)}
          />
        </Section>
        <Divider />

        <Section title="Surfaces">
          <Card>
            <KernText variant="title">Filled card</KernText>
          </Card>
          <Card variant="outlined">
            <KernText variant="title">Outlined card</KernText>
          </Card>
          <ListItem title="Ride to Central" supporting="Today, 18:20" />
          <Badge>3</Badge>
          <Badge variant="dot" />
        </Section>
      </ScrollView>
    </SafeAreaView>
  );
}
