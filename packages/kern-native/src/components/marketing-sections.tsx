import type { ReactNode } from "react";
import {
  Pressable,
  type StyleProp,
  StyleSheet,
  View,
  type ViewProps,
  type ViewStyle,
} from "react-native";
import { useKernScheme } from "../theme";
import { Card } from "./card";
import { StatusPill } from "./status-pill";
import { Text } from "./text";

/**
 * MarketingSections — native twin of the start `marketing-sections`
 * (D951 WP4; base SITE needs). Same section contracts (features/pricing/
 * testimonials/CTA); hero is a host node, never re-implemented. Colors
 * from `useKernScheme()`, metrics in dp.
 */

export type MarketingFeature = {
  id: string;
  title: string;
  description?: string;
  icon?: ReactNode;
};

export type NativeFeatureGridProps = Omit<ViewProps, "children" | "style"> & {
  title?: string;
  description?: string;
  items: MarketingFeature[];
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

const sectionsStatic = StyleSheet.create({
  section: { flexDirection: "column", gap: 16 },
  grid: { flexDirection: "column", gap: 16 },
  card: { padding: 16, flexDirection: "column", gap: 8 },
  priceRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 8,
  },
  cta: { borderRadius: 28, padding: 24, flexDirection: "column", gap: 8 },
  featureList: { flexDirection: "column", gap: 8, marginTop: 8 },
  featureRow: { flexDirection: "row", gap: 8, alignItems: "flex-start" },
  dot: { width: 6, height: 6, borderRadius: 3, marginTop: 7 },
});

export function FeatureGrid({
  title,
  description,
  items,
  style,
  testID,
  ...props
}: NativeFeatureGridProps) {
  const scheme = useKernScheme();
  return (
    <View
      {...props}
      testID={testID ?? "kern-marketing-features"}
      accessibilityLabel={title ?? "Features"}
      style={[sectionsStatic.section, style]}
    >
      {title ? (
        <Text variant="headline" accessibilityRole="header">
          {title}
        </Text>
      ) : null}
      {description ? (
        <Text style={{ color: scheme.color.onSurfaceVariant }}>
          {description}
        </Text>
      ) : null}
      <View style={sectionsStatic.grid}>
        {items.map((item) => (
          <Card
            key={item.id}
            testID={`kern-marketing-feature-${item.id}`}
            style={sectionsStatic.card}
          >
            {item.icon}
            <Text variant="title">{item.title}</Text>
            {item.description ? (
              <Text style={{ color: scheme.color.onSurfaceVariant }}>
                {item.description}
              </Text>
            ) : null}
          </Card>
        ))}
      </View>
    </View>
  );
}

export type MarketingPlan = {
  id: string;
  name: string;
  price: string;
  blurb?: string;
  features: string[];
  highlighted?: boolean;
  badge?: string;
};

export type NativePricingTableProps = Omit<ViewProps, "children" | "style"> & {
  title?: string;
  description?: string;
  plans: MarketingPlan[];
  /** Plan pick notification (allowlisted DOMAIN action). */
  onSelect?: (plan: string) => void;
  selectLabel?: string;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function PricingTable({
  title,
  description,
  plans,
  onSelect,
  selectLabel = "Choose plan",
  style,
  testID,
  ...props
}: NativePricingTableProps) {
  const scheme = useKernScheme();
  return (
    <View
      {...props}
      testID={testID ?? "kern-marketing-pricing"}
      accessibilityLabel={title ?? "Pricing"}
      style={[sectionsStatic.section, style]}
    >
      {title ? (
        <Text variant="headline" accessibilityRole="header">
          {title}
        </Text>
      ) : null}
      {description ? (
        <Text style={{ color: scheme.color.onSurfaceVariant }}>
          {description}
        </Text>
      ) : null}
      <View style={sectionsStatic.grid}>
        {plans.map((plan) => (
          <Card
            key={plan.id}
            testID={`kern-marketing-plan-${plan.id}`}
            variant={plan.highlighted ? "outlined" : "filled"}
            style={[
              sectionsStatic.card,
              plan.highlighted && {
                borderWidth: 2,
                borderColor: scheme.color.primary,
              },
            ]}
          >
            <View style={sectionsStatic.priceRow}>
              <Text variant="title">{plan.name}</Text>
              {plan.badge ? (
                <StatusPill tone={plan.highlighted ? "primary" : "neutral"}>
                  {plan.badge}
                </StatusPill>
              ) : null}
            </View>
            <Text variant="headline">{plan.price}</Text>
            {plan.blurb ? (
              <Text style={{ color: scheme.color.onSurfaceVariant }}>
                {plan.blurb}
              </Text>
            ) : null}
            <View style={sectionsStatic.featureList}>
              {plan.features.map((feature, index) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: static host marketing copy with no identity — never reordered.
                <View key={index} style={sectionsStatic.featureRow}>
                  <View
                    style={[
                      sectionsStatic.dot,
                      { backgroundColor: scheme.color.primary },
                    ]}
                  />
                  <Text>{feature}</Text>
                </View>
              ))}
            </View>
            {onSelect ? (
              <Pressable
                onPress={() => onSelect(plan.id)}
                accessibilityRole="button"
                accessibilityLabel={`${selectLabel}: ${plan.name}`}
                testID={`kern-pricing-select-${plan.id}`}
                style={{
                  marginTop: 16,
                  minHeight: 48,
                  borderRadius: 9999,
                  alignItems: "center",
                  justifyContent: "center",
                  paddingHorizontal: 24,
                  backgroundColor: plan.highlighted
                    ? scheme.color.primary
                    : "transparent",
                  borderWidth: plan.highlighted ? 0 : 1,
                  borderColor: scheme.color.outline,
                }}
              >
                <Text
                  style={{
                    color: plan.highlighted
                      ? scheme.color.onPrimary
                      : scheme.color.primary,
                    fontWeight: "500",
                  }}
                >
                  {selectLabel}
                </Text>
              </Pressable>
            ) : null}
          </Card>
        ))}
      </View>
    </View>
  );
}

export type MarketingTestimonial = {
  id: string;
  quote: string;
  author: string;
  role?: string;
};

export type NativeTestimonialListProps = Omit<
  ViewProps,
  "children" | "style"
> & {
  title?: string;
  items: MarketingTestimonial[];
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function TestimonialList({
  title,
  items,
  style,
  testID,
  ...props
}: NativeTestimonialListProps) {
  const scheme = useKernScheme();
  return (
    <View
      {...props}
      testID={testID ?? "kern-marketing-testimonials"}
      accessibilityLabel={title ?? "Testimonials"}
      style={[sectionsStatic.section, style]}
    >
      {title ? (
        <Text variant="headline" accessibilityRole="header">
          {title}
        </Text>
      ) : null}
      <View style={sectionsStatic.grid}>
        {items.map((item) => (
          <Card
            key={item.id}
            testID={`kern-marketing-testimonial-${item.id}`}
            style={sectionsStatic.card}
          >
            <Text variant="body">{item.quote}</Text>
            <Text
              variant="label"
              style={{ color: scheme.color.onSurfaceVariant }}
            >
              {item.role ? `${item.author} · ${item.role}` : item.author}
            </Text>
          </Card>
        ))}
      </View>
    </View>
  );
}

export type NativeCtaBannerProps = Omit<ViewProps, "children" | "style"> & {
  title: string;
  description?: string;
  actions?: ReactNode;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

export function CtaBanner({
  title,
  description,
  actions,
  style,
  testID,
  ...props
}: NativeCtaBannerProps) {
  const scheme = useKernScheme();
  return (
    <View
      {...props}
      testID={testID ?? "kern-marketing-cta"}
      accessibilityLabel={title}
      style={[
        sectionsStatic.cta,
        { backgroundColor: scheme.color.primary },
        style,
      ]}
    >
      <Text variant="headline" style={{ color: scheme.color.onPrimary }}>
        {title}
      </Text>
      {description ? (
        <Text style={{ color: scheme.color.onPrimary }}>{description}</Text>
      ) : null}
      {actions}
    </View>
  );
}

export type NativeMarketingSectionsProps = {
  hero?: ReactNode;
  features?: MarketingFeature[];
  featuresTitle?: string;
  plans?: MarketingPlan[];
  pricingTitle?: string;
  onSelect?: (plan: string) => void;
  testimonials?: MarketingTestimonial[];
  testimonialsTitle?: string;
  cta?: NativeCtaBannerProps;
  style?: StyleProp<ViewStyle>;
  testID?: string;
};

/** Hero slot + sections: the base SITE page pattern (native). */
export function MarketingSections({
  hero,
  features = [],
  featuresTitle,
  plans = [],
  pricingTitle,
  onSelect,
  testimonials = [],
  testimonialsTitle,
  cta,
  style,
  testID,
}: NativeMarketingSectionsProps) {
  return (
    <View
      testID={testID ?? "kern-marketing-sections"}
      style={[{ flexDirection: "column", gap: 48, padding: 16 }, style]}
    >
      {hero}
      {features.length > 0 ? (
        <FeatureGrid title={featuresTitle} items={features} />
      ) : null}
      {plans.length > 0 ? (
        <PricingTable title={pricingTitle} plans={plans} onSelect={onSelect} />
      ) : null}
      {testimonials.length > 0 ? (
        <TestimonialList title={testimonialsTitle} items={testimonials} />
      ) : null}
      {cta ? <CtaBanner {...cta} /> : null}
    </View>
  );
}
