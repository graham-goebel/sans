import { Button, CtaBlock, FeatureGridBlock, HeroBlock, Image, Inline, StatsBlock, TestimonialBlock } from "@dovetail-ds/react";

export function Landing() {
  return (
    <div style={{ background: "var(--dt-surface-base)" }}>
      <HeroBlock eyebrow="The autumn collection" title="Made slowly. Used every day." lead="Stoneware, glass and brass from small workshops, made to be used, washed and used again." actions={<>
          <Inline gap="sm">
            <Button size="sm">Shop the collection</Button>
            <Button size="sm" variant="secondary">Our story</Button>
          </Inline>
        </>} media={<>
          <Image alt="" ratio="4:3" src="data:image/svg+xml,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20viewBox%3D'0%200%20100%20100'%3E%3Crect%20width%3D'100'%20height%3D'100'%20fill%3D'%23e8e2d8'%2F%3E%3Cellipse%20cx%3D'48'%20cy%3D'77'%20rx%3D'24'%20ry%3D'4'%20fill%3D'%23000'%20opacity%3D'.08'%2F%3E%3Cpath%20d%3D'M64%2043h5a8%208%200%200%201%200%2016h-5'%20fill%3D'none'%20stroke%3D'%235d7a6a'%20stroke-width%3D'5'%2F%3E%3Crect%20x%3D'30'%20y%3D'34'%20width%3D'36'%20height%3D'43'%20rx%3D'5'%20fill%3D'%235d7a6a'%2F%3E%3C%2Fsvg%3E" />
        </>} />
      <FeatureGridBlock eyebrow="Why it lasts" title="Built for the everyday" columns={3} items={[{ title: "Fired twice", description: "A second firing makes the glaze hard enough for the dishwasher." }, { title: "Repairable", description: "Chips and cracks are mended free for the first five years." }, { title: "Made nearby", description: "Every piece comes from a workshop within a day's drive." }]} tone="subtle" />
      <StatsBlock title="By the numbers" stats={[{ value: "12", label: "Workshops" }, { value: "4,800", label: "Pieces this year" }, { value: "5 yrs", label: "Free repairs" }]} />
      <TestimonialBlock title="Kind words" quotes={[{ quote: "The only mug in the house everyone fights over.", name: "Ana Ruiz", role: "Customer since 2021" }, { quote: "Sent one back with a chip and it came home mended.", name: "Sam Okafor", role: "Customer since 2019" }]} tone="subtle" />
      <CtaBlock title="Ready for a better mug?" lead="Free shipping over $75, and free repairs for five years." tone="brand" actions={<>
          <Button size="sm">Shop now</Button>
        </>} />
    </div>
  );
}
