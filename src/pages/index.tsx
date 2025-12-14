import type {ReactNode} from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Translate, {translate} from '@docusaurus/Translate';
import Head from '@docusaurus/Head';
import {useLocation} from '@docusaurus/router';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';
import Heading from '@theme/Heading';

import styles from './index.module.css';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <Heading as="h1" className="hero__title">
          <Translate id="homepage.hero.title">Beeping Docs</Translate>
        </Heading>
        <p className="hero__subtitle">
          <Translate id="homepage.hero.subtitle">
            Official documentation for the Beeping ecosystem.
          </Translate>
        </p>
        <div className={styles.buttons}>
          <Link
            className="button button--secondary button--lg"
            to={`/docs/${'introduction'}`}>
            <Translate id="homepage.hero.cta">Get started</Translate>
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home(): ReactNode {
  const {pathname} = useLocation();
  const homeTitle = pathname.startsWith('/es')
    ? 'Documentación del Beeping'
    : 'Beeping Documentation';
  return (
    <Layout description={translate({
      id: 'homepage.meta.description',
      message: 'Documentation hub for the Beeping ecosystem.',
    })}>
      <Head>
        <title>{homeTitle}</title>
      </Head>
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
