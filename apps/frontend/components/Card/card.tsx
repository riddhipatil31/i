import React from 'react';
import Link from 'next/link';

import { ArticleEntity } from '../../generated/graphql';
import StrapiImage from '../strapiImage';
import rehypeRaw from 'rehype-raw';
import ReactMarkdown from 'react-markdown';
import Moment from '../../lib/moment';
import {
  Center,
  useColorModeValue,
  Stack,
  Heading,
  Avatar,
  Box,
  Text,
  Tag,
} from '@chakra-ui/react';
import { css, jsx } from '@emotion/react';

function ArticleLink({
  children,
  article,
}: {
  children: React.ReactNode;
  article: ArticleEntity;
}) {
  const ARTICLE_PATH = 'artykul';

  return (
    <Link passHref href={`/${ARTICLE_PATH}/${article.attributes.slug}`}>
      <a>{children}</a>
    </Link>
  );
}

function Category({ article }: { article: ArticleEntity }) {
  if (article.attributes.category.data === null) {
    console.debug(
      'No image data for item. This is correct for optional fields!'
    );

    return null;
  }

  return (
    <Link
      passHref
      href={`/kategoria/${article.attributes.category.data.attributes.slug}`}
    >
      <a>
          <span>{article.attributes.category.data.attributes.name}</span>
      </a>
    </Link>
  );
}

function BulletPoint() {
  return <span>&nbsp;&bull;&nbsp;</span>;
}

function CardContent({ article }: { article: ArticleEntity }) {
  const MAX_CHARACTERS = 1000;
  const content = article.attributes.content.substring(0, MAX_CHARACTERS);

  return <ReactMarkdown css={css`color: #718096`} children={content} rehypePlugins={[rehypeRaw]} />;
}

function CardTitle({ article }: { article: ArticleEntity }) {
  return (
    <ArticleLink article={article}>
      <Heading
        color={useColorModeValue('gray.700', 'white')}
        fontSize={'2xl'}
        fontWeight={'medium'}
        as="h3"
        fontFamily={'body'}
      >
        {article.attributes.title}
      </Heading>
    </ArticleLink>
  );
}

function CardDate({ article }: { article: ArticleEntity }) {
  const DATE_FORMAT = 'Do MMMM YYYY, HH:mm';

  return <Moment format={DATE_FORMAT}>{article.attributes.publishedAt}</Moment>;
}

export function CardMeta({ article }: { article: ArticleEntity }) {
  return (
    <Text
      color={'blue.400'}
      textTransform={'uppercase'}
      fontWeight={500}
      fontSize={'sm'}
      letterSpacing={1.1}
    >
      <CardDate article={article} />
      {article.attributes.category.data !== null && <BulletPoint />}
      <Category article={article} />
    </Text>
  );
}

function Card({ article }: { article: ArticleEntity }) {
  return (
    <li
      css={css`
        list-style-type: none;
      `}
      key={`article-${article.attributes.slug}`}
    >
      <article>
        <Center py={4}>
          <Box
            border="1px"
            borderColor="gray.200"
            w={'full'}
            bg={useColorModeValue('white', 'gray.900')}
            boxShadow={'lg'}
            rounded={'md'}
          >
            <Box bg={'gray.100'}>
              <StrapiImage
                image={article.attributes.image}
                imageProps={{ style: { borderRadius: '4px' } }}
              />
            </Box>
            <Stack p={6}>
              <CardMeta article={article} />
              <CardTitle article={article} />
              <CardContent article={article} />
            </Stack>
          </Box>
        </Center>
      </article>
    </li>
  );
}

export default Card;
