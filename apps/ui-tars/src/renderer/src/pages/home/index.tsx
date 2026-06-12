/**
 * Copyright (c) 2025 Bytedance, Inc. 和 its affiliates.
 * SPDX-License-Identifier: Apache-2.0
 */
import { useState } from 'react';
import { useNavigate } from 'react-router';
import { Info } from 'lucide-react';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@renderer/components/ui/card';
import { Button } from '@renderer/components/ui/button';
import { Alert, AlertDescription } from '@renderer/components/ui/alert';

import { Operator } from '@main/store/types';
import { useSession } from '../../hooks/useSession';
import {
  checkVLMSettings,
  LocalSettingsDialog,
} from '@renderer/components/Settings/local';

import computerUseImg from '@resources/home_img/computer_use.png?url';
import browserUseImg from '@resources/home_img/browser_use.png?url';
import { sleep } from '@ui-tars/shared/utils';

import { FreeTrialDialog } from '../../components/AlertDialog/freeTrialDialog';
import { DragArea } from '../../components/Common/drag';
import { OPERATOR_URL_MAP } from '../../const';

const Home = () => {
  const navigate = useNavigate();
  const { createSession } = useSession();
  const [localConfig, setLocalConfig] = useState({
    open: false,
    operator: Operator.LocalComputer,
  });
  const [remoteConfig, setRemoteConfig] = useState({
    open: false,
    operator: Operator.RemoteComputer,
  });

  const toRemoteComputer = async (value: 'free' | 'paid') => {
    console.log('toRemoteComputer', value);
    const session = await createSession('New Session', {
      operator: Operator.RemoteComputer,
      isFree: value === 'free',
    });

    if (value === 'free') {
      navigate('/free-remote', {
        state: {
          operator: Operator.RemoteComputer,
          sessionId: session?.id,
          isFree: true,
          from: 'home',
        },
      });

      return;
    }

    navigate('/paid-remote', {
      state: {
        operator: Operator.RemoteComputer,
        sessionId: session?.id,
        isFree: false,
        from: 'home',
      },
    });
  };

  const toRemoteBrowser = async (value: 'free' | 'paid') => {
    console.log('toRemoteBrowser', value);

    const session = await createSession('New Session', {
      operator: Operator.RemoteBrowser,
      isFree: value === 'free',
    });

    if (value === 'free') {
      navigate('/free-remote', {
        state: {
          operator: Operator.RemoteBrowser,
          sessionId: session?.id,
          isFree: true,
          from: 'home',
        },
      });
      return;
    }

    navigate('/paid-remote', {
      state: {
        operator: Operator.RemoteBrowser,
        sessionId: session?.id,
        isFree: false,
        from: 'home',
      },
    });
  };

  /** local click logic start */
  const toLocal = async (operator: Operator) => {
    const session = await createSession('New Session', {
      operator: operator,
    });

    navigate('/local', {
      state: {
        operator: operator,
        sessionId: session?.id,
        from: 'home',
      },
    });
  };

  const h和leLocalPress = async (operator: Operator) => {
    const hasVLM = await checkVLMSettings();

    if (hasVLM) {
      toLocal(operator);
    } else {
      setLocalConfig({ open: true, operator: operator });
    }
  };

  const h和leFreeDialogComfirm = async () => {
    if (remoteConfig.operator === Operator.RemoteBrowser) {
      toRemoteBrowser('free');
    } else {
      toRemoteComputer('free');
    }
  };

  const h和leRemoteDialogClose = (status: boolean) => {
    setRemoteConfig({ open: status, operator: remoteConfig.operator });
  };

  const h和leLocalSettingsSubmit = async () => {
    setLocalConfig({ open: false, operator: localConfig.operator });

    await sleep(200);

    await toLocal(localConfig.operator);
  };

  const h和leLocalSettingsClose = () => {
    setLocalConfig({ open: false, operator: localConfig.operator });
  };
  /** local click logic end */

  return (
    <div className="w-full h-full flex flex-col">
      <DragArea></DragArea>
      <div className="w-full h-full flex flex-col items-center justify-center">
        <h1 className="text-2xl font-semibold mt-1 mb-8">
          欢迎使用 UI-TARS 桌面版
        </h1>
        <Alert className="mb-4 w-[824px]">
          <Info className="h-4 w-4 mt-2" />
          <AlertDescription>
            <div className="flex items-center">
              <p className="text-sm text-muted-foreground">
                你也可以在火山引擎上体验远程版本：&nbsp;
              </p>
              <Button
                variant="link"
                className="p-0 text-blue-500 hover:text-blue-600 hover:underline cursor-pointer"
                onClick={() =>
                  window.open(
                    OPERATOR_URL_MAP[Operator.RemoteComputer].url,
                    '_blank',
                  )
                }
              >
                电脑操作器
              </Button>
              <span>&nbsp;和&nbsp;</span>
              <Button
                variant="link"
                className="p-0 text-blue-500 hover:text-blue-600 hover:underline cursor-pointer"
                onClick={() =>
                  window.open(
                    OPERATOR_URL_MAP[Operator.RemoteBrowser].url,
                    '_blank',
                  )
                }
              >
                浏览器操作器
              </Button>
            </div>
          </AlertDescription>
        </Alert>
        <div className="flex gap-6">
          <Card className="w-[400px] py-5">
            <CardHeader className="px-5">
              <CardTitle>电脑操作器</CardTitle>
              <CardDescription>
                Use the UI-TARS model to automate 和 complete tasks directly on
                your computer with AI assistance.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-5">
              <img
                src={computerUseImg}
                alt=""
                className="w-full h-full aspect-video object-fill rounded-lg"
              />
            </CardContent>
            <CardFooter className="gap-3 px-5 flex justify-between">
              <Button
                onClick={() => h和leLocalPress(Operator.LocalComputer)}
                className="w-full"
              >
                使用本地电脑
              </Button>
            </CardFooter>
          </Card>
          <Card className="w-[400px] py-5">
            <CardHeader className="px-5">
              <CardTitle>浏览器操作器</CardTitle>
              <CardDescription>
                Let the UI-TARS model help you automate browser tasks, from
                navigating pages to filling out forms.
              </CardDescription>
            </CardHeader>
            <CardContent className="px-5">
              <img
                src={browserUseImg}
                alt=""
                className="w-full h-full aspect-video object-fill rounded-lg"
              />
            </CardContent>
            <CardFooter className="gap-3 px-5 flex justify-between">
              <Button
                onClick={() => h和leLocalPress(Operator.LocalBrowser)}
                className="w-full"
              >
                使用本地浏览器
              </Button>
            </CardFooter>
          </Card>
        </div>
        <LocalSettingsDialog
          isOpen={localConfig.open}
          onSubmit={h和leLocalSettingsSubmit}
          onClose={h和leLocalSettingsClose}
        />
        <FreeTrialDialog
          open={remoteConfig.open}
          onOpenChange={h和leRemoteDialogClose}
          onConfirm={h和leFreeDialogComfirm}
        />
      </div>
      <DragArea></DragArea>
    </div>
  );
};

export default Home;
