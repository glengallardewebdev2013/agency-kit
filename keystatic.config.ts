// The site's CMS, at /keystatic. Agencies use it for blog posts and SEO fields.
// Every field maps to a file in src/content, so each save is a Git commit.
//
// Locally (`npm run dev`) it edits files on disk. On the live site it uses
// GitHub mode: set PUBLIC_KEYSTATIC_GITHUB_REPO (owner/repo) at build time and
// the KEYSTATIC_* secrets on Cloudflare, as described in the README.
import { collection, config, fields, singleton } from '@keystatic/core';

const githubRepo = import.meta.env.PUBLIC_KEYSTATIC_GITHUB_REPO as `${string}/${string}` | undefined;

const seo = {
  seoTitle: fields.text({ label: 'SEO title', description: 'Optional. Overrides the page title in search results.' }),
  seoDescription: fields.text({
    label: 'SEO description',
    description: 'Optional. Overrides the summary in search results. Aim for 150 to 160 characters.',
    multiline: true,
  }),
};

const faqs = fields.array(
  fields.object({
    question: fields.text({ label: 'Question' }),
    answer: fields.text({ label: 'Answer', multiline: true }),
  }),
  { label: 'FAQs', itemLabel: (props) => props.fields.question.value || 'New question' },
);

const card = fields.object({
  title: fields.text({ label: 'Title' }),
  text: fields.text({ label: 'Text', multiline: true }),
});

export default config({
  storage: githubRepo ? { kind: 'github', repo: githubRepo } : { kind: 'local' },
  ui: {
    brand: { name: 'GallarDesign editor' },
    navigation: {
      Blog: ['posts'],
      Pages: ['home', 'about', 'services', 'industries', 'landing'],
      Settings: ['site'],
    },
  },
  singletons: {
    site: singleton({
      label: 'Site settings',
      path: 'src/content/settings/site',
      format: { data: 'json' },
      schema: {
        name: fields.text({ label: 'Business name', validation: { isRequired: true } }),
        tagline: fields.text({ label: 'Tagline' }),
        url: fields.url({ label: 'Website address', validation: { isRequired: true } }),
        locale: fields.text({ label: 'Language and region', defaultValue: 'en-US' }),
        phone: fields.text({ label: 'Phone' }),
        email: fields.text({ label: 'Email' }),
        address: fields.object(
          {
            street: fields.text({ label: 'Street' }),
            city: fields.text({ label: 'City' }),
            region: fields.text({ label: 'State or region' }),
            postalCode: fields.text({ label: 'Postal code' }),
            country: fields.text({ label: 'Country code', defaultValue: 'US' }),
          },
          { label: 'Address' },
        ),
        hours: fields.text({ label: 'Opening hours' }),
        businessType: fields.text({
          label: 'Schema business type',
          description: 'A schema.org type such as Plumber, Dentist, LegalService or LocalBusiness.',
          defaultValue: 'LocalBusiness',
        }),
        social: fields.array(fields.url({ label: 'Profile URL' }), { label: 'Social profiles', itemLabel: (p) => p.value ?? '' }),
        tracking: fields.object(
          {
            gtmId: fields.text({ label: 'Google Tag Manager ID (GTM-...)' }),
            ga4Id: fields.text({ label: 'Google Analytics 4 ID (G-...)' }),
            metaPixelId: fields.text({ label: 'Meta Pixel ID' }),
            googleAdsId: fields.text({ label: 'Google Ads ID (AW-...)' }),
            googleAdsLeadLabel: fields.text({ label: 'Google Ads lead conversion label' }),
          },
          { label: 'Tracking' },
        ),
        formSuccessMessage: fields.text({ label: 'Form thank-you message', multiline: true }),
        demo: fields.checkbox({ label: 'Demo content', description: 'Untick once real content is in.' }),
      },
    }),
    home: singleton({
      label: 'Home page',
      path: 'src/content/singletons/home',
      format: { data: 'json' },
      schema: {
        title: fields.text({ label: 'SEO title' }),
        description: fields.text({ label: 'SEO description', multiline: true }),
        heroHeadline: fields.text({ label: 'Headline' }),
        heroText: fields.text({ label: 'Intro sentence', multiline: true }),
        primaryLabel: fields.text({ label: 'Main button' }),
        secondaryLabel: fields.text({ label: 'Second button' }),
        servicesHeading: fields.text({ label: 'Services heading' }),
        servicesIntro: fields.text({ label: 'Services intro', multiline: true }),
        reasonsHeading: fields.text({ label: 'Reasons heading' }),
        reasons: fields.array(card, { label: 'Reasons', itemLabel: (p) => p.fields.title.value || 'New reason' }),
        faqHeading: fields.text({ label: 'FAQ heading' }),
        faqs,
        ctaHeading: fields.text({ label: 'Closing call to action heading' }),
        ctaText: fields.text({ label: 'Closing call to action text', multiline: true }),
      },
    }),
    about: singleton({
      label: 'About page',
      path: 'src/content/singletons/about',
      format: { data: 'json' },
      schema: {
        title: fields.text({ label: 'SEO title' }),
        description: fields.text({ label: 'SEO description', multiline: true }),
        heading: fields.text({ label: 'Headline' }),
        intro: fields.text({ label: 'Intro', multiline: true }),
        paragraphs: fields.array(fields.text({ label: 'Paragraph', multiline: true }), {
          label: 'Paragraphs',
          itemLabel: (p) => (p.value ?? '').slice(0, 60),
        }),
      },
    }),
  },
  collections: {
    services: collection({
      label: 'Services',
      slugField: 'title',
      path: 'src/content/services/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        summary: fields.text({ label: 'Summary', multiline: true }),
        order: fields.integer({ label: 'Order', defaultValue: 100 }),
        faqs,
        ...seo,
        content: fields.markdoc({ label: 'Page content', extension: 'md' }),
      },
    }),
    industries: collection({
      label: 'Industries',
      slugField: 'title',
      path: 'src/content/industries/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Industry' } }),
        summary: fields.text({ label: 'Summary', multiline: true }),
        headline: fields.text({ label: 'Page headline', description: 'Lead with the outcome and the terms.' }),
        order: fields.integer({ label: 'Order', defaultValue: 100 }),
        points: fields.array(fields.text({ label: 'Point' }), { label: 'What the site includes', itemLabel: (p) => p.value ?? '' }),
        faqs,
        ...seo,
        content: fields.markdoc({ label: 'Page content', extension: 'md' }),
      },
    }),
    posts: collection({
      label: 'Blog posts',
      slugField: 'title',
      path: 'src/content/posts/*',
      format: { contentField: 'content' },
      schema: {
        title: fields.slug({ name: { label: 'Title' } }),
        summary: fields.text({ label: 'Summary', multiline: true }),
        published: fields.date({ label: 'Published', validation: { isRequired: true } }),
        updated: fields.date({ label: 'Updated' }),
        draft: fields.checkbox({ label: 'Draft' }),
        ...seo,
        content: fields.markdoc({ label: 'Post', extension: 'md' }),
      },
    }),
    landing: collection({
      label: 'Landing pages',
      slugField: 'title',
      path: 'src/content/landing/*',
      format: { data: 'json' },
      schema: {
        title: fields.slug({ name: { label: 'SEO title' } }),
        description: fields.text({ label: 'SEO description', multiline: true }),
        headline: fields.text({ label: 'Headline' }),
        subhead: fields.text({ label: 'Subhead', multiline: true }),
        points: fields.array(fields.text({ label: 'Point' }), { label: 'Selling points', itemLabel: (p) => p.value ?? '' }),
        formHeading: fields.text({ label: 'Form heading' }),
        submitLabel: fields.text({ label: 'Button label' }),
      },
    }),
  },
});
