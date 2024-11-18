import type {TypeFromSelection} from 'groqd';

import type {SectionDefaultProps} from '~/lib/type';
import type {FOOTER_SOCIAL_LINKS_ONLY_FRAGMENT} from '~/qroq/footers';

import {useColorsCssVars} from '~/hooks/useColorsCssVars';

import {CountrySelector} from '../layout/CountrySelector';
import {SocialMediaButtons} from '../SocialMedia';

type FooterSocialLinksOnlyProps = TypeFromSelection<
  typeof FOOTER_SOCIAL_LINKS_ONLY_FRAGMENT
>;

export function FooterSocialLinksOnly(
  props: {data: FooterSocialLinksOnlyProps} & SectionDefaultProps,
) {
  const {data} = props;
  const colorsCssVars = useColorsCssVars({
    selector: '#country-selector',
    settings: data.settings,
  });

  return (
    <div className="container flex flex-row items-center justify-between gap-5">
      <style dangerouslySetInnerHTML={{__html: colorsCssVars}} />
      <div className="flex flex-col flex-wrap items-left justify-start gap-5">
        <SocialMediaButtons />
        <CountrySelector />
      </div>
      
      <p className="mt-4">{data.copyright}</p>
    </div>
  );
}
